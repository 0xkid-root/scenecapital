import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// IP Asset interface
interface IPAsset {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  category: string;
  price: number;
  marketCap: number;
  totalSupply: number;
  availableSupply: number;
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
  metadata?: {
    [key: string]: any;
  };
}

// Category distribution interface
interface CategoryDistribution {
  category: string;
  count: number;
  marketCap: number;
  percentage: number;
}

// Response interface
interface IPAssetsResponse {
  success: boolean;
  data?: {
    assets: IPAsset[];
    pagination: {
      page: number;
      limit: number;
      totalAssets: number;
      totalPages: number;
    };
    categories: CategoryDistribution[];
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

// Validation schema
const querySchema = z.object({
  userId: z.string().uuid(),
  category: z.string().optional(),
  creator: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['marketCap', 'price', 'royaltyRate', 'tradingVolume', 'name']).default('marketCap'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().int().min(1).max(100).default(20),
  page: z.number().int().min(1).default(1),
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
    const queryResult = querySchema.safeParse({
      userId: decodedToken.userId,
      category: searchParams.get('category'),
      creator: searchParams.get('creator'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      limit: parseInt(searchParams.get('limit') || '20'),
      page: parseInt(searchParams.get('page') || '1'),
    });

    if (!queryResult.success) {
      logger.warn('Invalid query parameters', { errors: queryResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, category, creator, search, sortBy, sortOrder, limit, page } = queryResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const assetsCollection = db.collection<IPAsset>('ip_assets');

    // Build query
    const query: any = { userId: sanitizeInput(userId) };
    if (category) {
      query.category = sanitizeInput(category);
    }
    if (creator) {
      query.creator = { $regex: sanitizeInput(creator), $options: 'i' };
    }
    if (search) {
      const searchRegex = sanitizeInput(search);
      query.$or = [
        { name: { $regex: searchRegex, $options: 'i' } },
        { symbol: { $regex: searchRegex, $options: 'i' } },
        { description: { $regex: searchRegex, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const totalAssets = await assetsCollection.countDocuments(query);

    // Fetch assets from MongoDB
    const rawAssets = await assetsCollection
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        id: 1,
        name: 1,
        symbol: 1,
        creator: 1,
        category: 1,
        price: 1,
        marketCap: 1,
        totalSupply: 1,
        availableSupply: 1,
        royaltyRate: 1,
        description: 1,
        image: 1,
        performance: 1,
        tradingVolume: 1,
        createdAt: 1,
        metadata: 1,
      })
      .toArray();
      
    // Convert MongoDB documents to IPAsset type
    const assets: IPAsset[] = rawAssets.map(item => ({
      id: item.id as string,
      name: item.name as string,
      symbol: item.symbol as string,
      creator: item.creator as string,
      category: item.category as string,
      price: item.price as number,
      marketCap: item.marketCap as number,
      totalSupply: item.totalSupply as number,
      availableSupply: item.availableSupply as number,
      royaltyRate: item.royaltyRate as number,
      description: item.description as string,
      image: item.image as string | undefined,
      performance: item.performance as { day: number; week: number; month: number },
      tradingVolume: item.tradingVolume as number,
      createdAt: item.createdAt as string,
      metadata: item.metadata as { [key: string]: any } | undefined
    }));

    // Calculate category distribution
    const categoryDistribution = await assetsCollection
      .aggregate([
        { $match: { userId: sanitizeInput(userId) } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            marketCap: { $sum: '$marketCap' },
          },
        },
      ])
      .toArray();

    const totalMarketCap = categoryDistribution.reduce((sum, cat) => sum + cat.marketCap, 0);
    const categories = categoryDistribution.map((cat) => ({
      category: cat._id,
      count: cat.count,
      marketCap: cat.marketCap,
      percentage: totalMarketCap > 0 ? (cat.marketCap / totalMarketCap) * 100 : 0,
    }));

    const response: IPAssetsResponse = {
      success: true,
      data: {
        assets,
        pagination: {
          page,
          limit,
          totalAssets,
          totalPages: Math.ceil(totalAssets / limit),
        },
        categories,
      },
    };

    // Log successful request
    logger.info('IP assets fetched', {
      userId,
      category,
      creator,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
      assetCount: assets.length,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(response, { headers: securityHeaders });

  } catch (error) {
    // Handle specific error types
    if (error instanceof RateLimiterMemory) {
      const clientIpAddress = request.headers.get('x-forwarded-for') || 'unknown';
      logger.warn('Rate limit exceeded', { clientIp: clientIpAddress });
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429, headers: securityHeaders }
      );
    }

    logger.error('IP assets error', {
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