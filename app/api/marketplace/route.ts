import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// Marketplace listing interface
interface MarketplaceListing {
  id: string;
  assetId: string;
  name: string;
  symbol: string;
  category: string;
  type: 'full' | 'fractional';
  price: number;
  quantity: number;
  totalValue: number;
  seller: {
    id: string;
    name: string;
    reputation: number;
  };
  royaltyRate: number;
  description: string;
  image?: string;
  performance: {
    day: number;
    week: number;
    month: number;
  };
  tradingVolume: number;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'pending' | 'sold' | 'expired';
  metadata?: {
    [key: string]: any;
  };
}

// Response interfaces
interface MarketplaceListingsResponse {
  success: boolean;
  data?: {
    listings: MarketplaceListing[];
    pagination: {
      page: number;
      limit: number;
      totalListings: number;
      totalPages: number;
    };
    metrics: {
      totalMarketValue: number;
      categoryDistribution: Array<{
        category: string;
        count: number;
        totalValue: number;
        percentage: number;
      }>;
      typeDistribution: Array<{
        type: string;
        count: number;
        totalValue: number;
        percentage: number;
      }>;
    };
  };
  message?: string;
}

interface CreateListingResponse {
  success: boolean;
  data?: {
    listing: MarketplaceListing;
    message: string;
  };
  message?: string;
}

// MongoDB connection
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  cachedDb = client.db(process.env.MONGODB_DB);
  return cachedDb;
}

// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per minute
});

// Validation schemas
const getQuerySchema = z.object({
  userId: z.string().uuid(),
  category: z.string().optional(),
  type: z.enum(['full', 'fractional']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  status: z.enum(['active', 'pending', 'sold', 'expired']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'price', 'totalValue', 'royaltyRate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

const postBodySchema = z.object({
  assetId: z.string().regex(/^asset-[0-9a-fA-F-]+$/),
  type: z.enum(['full', 'fractional']),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  description: z.string().min(10).max(1000),
  expiresAt: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Expiration date must be in the future',
  }),
});

// Security headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    await rateLimiter.consume(clientIp);

    // Authentication check
    const authToken = cookies().get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Verify JWT token
    const decodedToken = await verifyToken(authToken);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryResult = getQuerySchema.safeParse({
      userId: decodedToken.userId,
      category: searchParams.get('category'),
      type: searchParams.get('type'),
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });

    if (!queryResult.success) {
      logger.warn('Invalid query parameters', { errors: queryResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, category, type, minPrice, maxPrice, status, search, sortBy, sortOrder, page, limit } = queryResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const listingsCollection = db.collection<MarketplaceListing>('marketplace_listings');

    // Build query
    const query: any = { userId: sanitizeInput(userId) };
    if (category) query.category = sanitizeInput(category);
    if (type) query.type = type;
    if (minPrice !== undefined) query.price = { $gte: minPrice };
    if (maxPrice !== undefined) query.price = { ...query.price, $lte: maxPrice };
    if (status) query.status = status;
    if (search) {
      const searchRegex = sanitizeInput(search);
      query.$or = [
        { name: { $regex: searchRegex, $options: 'i' } },
        { symbol: { $regex: searchRegex, $options: 'i' } },
        { description: { $regex: searchRegex, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const totalListings = await listingsCollection.countDocuments(query);

    // Fetch listings from MongoDB
    const listings = await listingsCollection
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        id: 1,
        assetId: 1,
        name: 1,
        symbol: 1,
        category: 1,
        type: 1,
        price: 1,
        quantity: 1,
        totalValue: 1,
        seller: 1,
        royaltyRate: 1,
        description: 1,
        image: 1,
        performance: 1,
        tradingVolume: 1,
        createdAt: 1,
        expiresAt: 1,
        status: 1,
        metadata: 1,
      })
      .toArray();

    // Calculate category distribution
    const categoryDistribution = await listingsCollection
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: '$totalValue' },
          },
        },
      ])
      .toArray();

    // Calculate type distribution
    const typeDistribution = await listingsCollection
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalValue: { $sum: '$totalValue' },
          },
        },
      ])
      .toArray();

    const totalMarketValue = listings.reduce((sum, listing) => sum + listing.totalValue, 0);

    const response: MarketplaceListingsResponse = {
      success: true,
      data: {
        listings,
        pagination: {
          page,
          limit,
          totalListings,
          totalPages: Math.ceil(totalListings / limit),
        },
        metrics: {
          totalMarketValue,
          categoryDistribution: categoryDistribution.map((cat) => ({
            category: cat._id,
            count: cat.count,
            totalValue: cat.totalValue,
            percentage: totalMarketValue > 0 ? (cat.totalValue / totalMarketValue) * 100 : 0,
          })),
          typeDistribution: typeDistribution.map((type) => ({
            type: type._id,
            count: type.count,
            totalValue: type.totalValue,
            percentage: totalMarketValue > 0 ? (type.totalValue / totalMarketValue) * 100 : 0,
          })),
        },
      },
    };

    // Log successful request
    logger.info('Marketplace listings fetched', {
      userId,
      category,
      type,
      status,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
      listingCount: listings.length,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(response, { headers: securityHeaders });

  } catch (error) {
    // Handle specific error types
    if (error instanceof RateLimiterMemory) {
      logger.warn('Rate limit exceeded', { clientIp });
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429, headers: securityHeaders }
      );
    }

    logger.error('Marketplace listings error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    await rateLimiter.consume(clientIp);

    // Authentication check
    const authToken = cookies().get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Verify JWT token
    const decodedToken = await verifyToken(authToken);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Get and validate request body
    const body = await request.json();
    const bodyResult = postBodySchema.safeParse(body);

    if (!bodyResult.success) {
      logger.warn('Invalid request body', { errors: bodyResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { assetId, type, price, quantity, description, expiresAt } = bodyResult.data;
    const userId = decodedToken.userId;

    // Connect to database
    const db = await connectToDatabase();
    const assetsCollection = db.collection('ip_assets');
    const listingsCollection = db.collection<MarketplaceListing>('marketplace_listings');
    const usersCollection = db.collection('users');

    // Verify asset exists
    const asset = await assetsCollection.findOne({ id: sanitizeInput(assetId), userId: sanitizeInput(userId) });
    if (!asset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Fetch user data for seller information
    const user = await usersCollection.findOne({ id: sanitizeInput(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Create new listing
    const newListing: MarketplaceListing = {
      id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assetId: sanitizeInput(assetId),
      name: asset.name,
      symbol: asset.symbol,
      category: asset.category,
      type,
      price,
      quantity,
      totalValue: price * quantity,
      seller: {
        id: userId,
        name: user.name || 'Anonymous Seller',
        reputation: user.reputation || 4.5,
      },
      royaltyRate: asset.royaltyRate,
      description: sanitizeInput(description),
      image: asset.image,
      performance: asset.performance,
      tradingVolume: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      status: 'pending',
      metadata: asset.metadata,
    };

    // Save listing to database
    await listingsCollection.insertOne({
      ...newListing,
      userId: sanitizeInput(userId),
    });

    const response: CreateListingResponse = {
      success: true,
      data: {
        listing: newListing,
        message: 'Listing created successfully and pending approval',
      },
    };

    // Log successful request
    logger.info('Marketplace listing created', {
      userId,
      assetId,
      listingId: newListing.id,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(response, { headers: securityHeaders });

  } catch (error) {
    // Handle specific error types
    if (error instanceof RateLimiterMemory) {
      logger.warn('Rate limit exceeded', { clientIp });
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429, headers: securityHeaders }
      );
    }

    logger.error('Create listing error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

// Handle method not allowed
export async function OPTIONS() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405, headers: securityHeaders }
  );
}