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

// Transaction interface
interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  transactionHash?: string;
}

// Similar listing interface
interface SimilarListing {
  id: string;
  name: string;
  symbol: string;
  type: 'full' | 'fractional';
  price: number;
  image?: string;
}

// Price history interface
interface PriceHistory {
  date: string;
  price: number;
}

// Response interfaces
interface ListingDetailsResponse {
  success: boolean;
  data?: {
    listing: MarketplaceListing;
    transactions: Transaction[];
    similarListings: SimilarListing[];
    priceHistory: PriceHistory[];
  };
  message?: string;
}

interface UpdateListingResponse {
  success: boolean;
  data?: {
    listing: MarketplaceListing;
    message: string;
  };
  message?: string;
}

interface DeleteListingResponse {
  success: boolean;
  data?: {
    message: string;
  };
  message?: string;
}

interface PurchaseListingResponse {
  success: boolean;
  data?: {
    transaction: Transaction;
    message: string;
    nextSteps: string[];
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
const paramsSchema = z.object({
  userId: z.string().uuid(),
  id: z.string().regex(/^listing-[0-9a-fA-F-]+$/),
});

const updateBodySchema = z.object({
  price: z.number().positive().optional(),
  quantity: z.number().int().positive().optional(),
  description: z.string().min(10).max(1000).optional(),
  expiresAt: z
    .string()
    .refine((val) => new Date(val) > new Date(), { message: 'Expiration date must be in the future' })
    .optional(),
  status: z.enum(['active', 'pending', 'sold', 'expired']).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided for update' });

const purchaseBodySchema = z.object({
  action: z.literal('purchase'),
  quantity: z.number().int().positive(),
});

// Security headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Validate parameters
    const paramsResult = paramsSchema.safeParse({
      userId: decodedToken.userId,
      id: params.id,
    });

    if (!paramsResult.success) {
      logger.warn('Invalid parameters', { errors: paramsResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, id } = paramsResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const listingsCollection = db.collection<MarketplaceListing>('marketplace_listings');
    const transactionsCollection = db.collection<Transaction>('transactions');
    const priceHistoryCollection = db.collection('price_history');

    // Fetch the listing
    const listing = await listingsCollection.findOne({
      id: sanitizeInput(id),
      userId: sanitizeInput(userId),
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Fetch transaction history
    const rawTransactions = await transactionsCollection
      .find({ listingId: sanitizeInput(id) })
      .project({
        id: 1,
        listingId: 1,
        buyerId: 1,
        sellerId: 1,
        price: 1,
        quantity: 1,
        totalAmount: 1,
        status: 1,
        timestamp: 1,
        transactionHash: 1,
      })
      .toArray();
      
    // Convert MongoDB documents to Transaction type
    const listingTransactions: Transaction[] = rawTransactions.map(item => ({
      id: item.id as string,
      listingId: item.listingId as string,
      buyerId: item.buyerId as string,
      sellerId: item.sellerId as string,
      price: item.price as number,
      quantity: item.quantity as number,
      totalAmount: item.totalAmount as number,
      status: item.status as string,
      timestamp: item.timestamp as string,
      transactionHash: item.transactionHash as string | undefined
    }));

    // Fetch similar listings
    const rawSimilarListings = await listingsCollection
      .find({
        userId: sanitizeInput(userId),
        category: listing.category,
        id: { $ne: listing.id },
        status: 'active',
      })
      .limit(4)
      .project({
        id: 1,
        name: 1,
        symbol: 1,
        type: 1,
        price: 1,
        image: 1,
      })
      .toArray();
      
    // Convert MongoDB documents to SimilarListing type
    const similarListings: SimilarListing[] = rawSimilarListings.map(item => ({
      id: item.id as string,
      name: item.name as string,
      symbol: item.symbol as string,
      type: item.type as 'full' | 'fractional',
      price: item.price as number,
      image: item.image as string | undefined
    }));

    // Fetch price history
    let rawPriceHistory = await priceHistoryCollection
      .find({
        listingId: sanitizeInput(id),
        date: { $gte: listing.createdAt },
      })
      .sort({ date: 1 })
      .project({
        date: 1,
        price: 1,
        _id: 0,
      })
      .toArray();
      
    // Convert MongoDB documents to PriceHistory type
    let priceHistory: PriceHistory[] = rawPriceHistory.map(item => ({
      date: item.date as string,
      price: item.price as number
    }));

    // Generate mock price history if none exists
    if (!priceHistory.length) {
      priceHistory = await generatePriceHistory(listing);
      await priceHistoryCollection.insertMany(
        priceHistory.map((data) => ({
          ...data,
          listingId: sanitizeInput(id),
          userId: sanitizeInput(userId),
          createdAt: new Date(),
        }))
      );
    }

    const response: ListingDetailsResponse = {
      success: true,
      data: {
        listing,
        transactions: listingTransactions,
        similarListings,
        priceHistory,
      },
    };

    // Log successful request
    logger.info('Listing details fetched', {
      userId,
      listingId: id,
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

    logger.error('Get listing error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Validate parameters
    const paramsResult = paramsSchema.safeParse({
      userId: decodedToken.userId,
      id: params.id,
    });

    if (!paramsResult.success) {
      logger.warn('Invalid parameters', { errors: paramsResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, id } = paramsResult.data;

    // Get and validate request body
    const body = await request.json();
    const bodyResult = updateBodySchema.safeParse(body);

    if (!bodyResult.success) {
      logger.warn('Invalid request body', { errors: bodyResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400, headers: securityHeaders }
      );
    }

    const updateData = bodyResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const listingsCollection = db.collection<MarketplaceListing>('marketplace_listings');

    // Fetch the listing
    const listing = await listingsCollection.findOne({
      id: sanitizeInput(id),
      userId: sanitizeInput(userId),
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Check if the user is the seller
    if (listing.seller.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to update this listing' },
        { status: 403, headers: securityHeaders }
      );
    }

    // Prepare update
    const updatedListing = {
      ...listing,
      price: updateData.price || listing.price,
      quantity: updateData.quantity || listing.quantity,
      totalValue: (updateData.price || listing.price) * (updateData.quantity || listing.quantity),
      description: updateData.description ? sanitizeInput(updateData.description) : listing.description,
      expiresAt: updateData.expiresAt || listing.expiresAt,
      status: updateData.status || listing.status,
    };

    // Update listing in database
    await listingsCollection.updateOne(
      { id: sanitizeInput(id), userId: sanitizeInput(userId) },
      { $set: updatedListing }
    );

    const response: UpdateListingResponse = {
      success: true,
      data: {
        listing: updatedListing,
        message: 'Listing updated successfully',
      },
    };

    // Log successful request
    logger.info('Listing updated', {
      userId,
      listingId: id,
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

    logger.error('Update listing error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Validate parameters
    const paramsResult = paramsSchema.safeParse({
      userId: decodedToken.userId,
      id: params.id,
    });

    if (!paramsResult.success) {
      logger.warn('Invalid parameters', { errors: paramsResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, id } = paramsResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const listingsCollection = db.collection<MarketplaceListing>('marketplace_listings');

    // Fetch the listing
    const listing = await listingsCollection.findOne({
      id: sanitizeInput(id),
      userId: sanitizeInput(userId),
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Check if the user is the seller
    if (listing.seller.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to delete this listing' },
        { status: 403, headers: securityHeaders }
      );
    }

    // Delete listing from database
    await listingsCollection.deleteOne({
      id: sanitizeInput(id),
      userId: sanitizeInput(userId),
    });

    const response: DeleteListingResponse = {
      success: true,
      data: {
        message: 'Listing deleted successfully',
      },
    };

    // Log successful request
    logger.info('Listing deleted', {
      userId,
      listingId: id,
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

    logger.error('Delete listing error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Validate parameters
    const paramsResult = paramsSchema.safeParse({
      userId: decodedToken.userId,
      id: params.id,
    });

    if (!paramsResult.success) {
      logger.warn('Invalid parameters', { errors: paramsResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, id } = paramsResult.data;

    // Get and validate request body
    const body = await request.json();
    const bodyResult = purchaseBodySchema.safeParse(body);

    if (!bodyResult.success) {
      logger.warn('Invalid request body', { errors: bodyResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { action, quantity } = bodyResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const listingsCollection = db.collection<MarketplaceListing>('marketplace_listings');
    const transactionsCollection = db.collection<Transaction>('transactions');

    // Fetch the listing
    const listing = await listingsCollection.findOne({
      id: sanitizeInput(id),
      userId: sanitizeInput(userId),
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Check if the listing is active
    if (listing.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'This listing is not available for purchase' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Validate quantity
    if (quantity > listing.quantity) {
      return NextResponse.json(
        { success: false, message: 'Requested quantity exceeds available quantity' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Calculate total amount
    const totalAmount = listing.price * quantity;

    // Create new transaction
    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      listingId: listing.id,
      buyerId: userId,
      sellerId: listing.seller.id,
      price: listing.price,
      quantity,
      totalAmount,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    // Save transaction to database
    await transactionsCollection.insertOne(transaction);

    // Update listing quantity
    const updatedQuantity = listing.quantity - quantity;
    const updatedStatus = updatedQuantity === 0 ? 'sold' : listing.status;

    await listingsCollection.updateOne(
      { id: sanitizeInput(id), userId: sanitizeInput(userId) },
      {
        $set: {
          quantity: updatedQuantity,
          totalValue: listing.price * updatedQuantity,
          status: updatedStatus,
        },
      }
    );

    const response: PurchaseListingResponse = {
      success: true,
      data: {
        transaction,
        message: 'Purchase initiated successfully',
        nextSteps: [
          'Your purchase is being processed.',
          'You will receive a confirmation once the transaction is complete.',
          'You can view the status of your purchase in your orders.',
        ],
      },
    };

    // Log successful request
    logger.info('Purchase initiated', {
      userId,
      listingId: id,
      transactionId: transaction.id,
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

    logger.error('Purchase error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

// Helper function to generate price history
async function generatePriceHistory(listing: MarketplaceListing): Promise<PriceHistory[]> {
  const now = new Date();
  const startDate = new Date(listing.createdAt);
  const dayDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const priceData: PriceHistory[] = [];
  let currentPrice = listing.price * 0.9; // Start at 90% of current price

  for (let i = 0; i <= dayDiff; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Add some randomness but maintain an upward trend
    const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
    const trendFactor = 1 + (i / Math.max(1, dayDiff)) * 0.1; // Gradually increase

    currentPrice = currentPrice * randomFactor * trendFactor;

    // Ensure we reach the current price at the end
    if (i === dayDiff) {
      currentPrice = listing.price;
    }

    priceData.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2)),
    });
  }

  return priceData;
}

// Handle method not allowed
export async function OPTIONS() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405, headers: securityHeaders }
  );
}