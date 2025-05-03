import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// Order interface
interface Order {
  id: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  asset: {
    id: string;
    name: string;
    symbol: string;
    category: string;
    image?: string;
  };
  quantity: number;
  price: number;
  total: number;
  limitPrice?: number;
  status: 'open' | 'filled' | 'partial' | 'cancelled' | 'expired';
  filledQuantity?: number;
  createdAt: string;
  expiresAt?: string;
  userId: string;
  transactionHash?: string;
}

// Response interfaces
interface OrdersResponse {
  success: boolean;
  data?: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      totalOrders: number;
      totalPages: number;
    };
  };
  message?: string;
}

interface CreateOrderResponse {
  success: boolean;
  data?: Order;
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
  type: z.enum(['buy', 'sell']).optional(),
  orderType: z.enum(['market', 'limit']).optional(),
  status: z.enum(['open', 'filled', 'partial', 'cancelled', 'expired']).optional(),
  assetId: z.string().regex(/^asset-[0-9a-fA-F-]+$/).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  page: z.number().int().min(1).default(1),
});

const postBodySchema = z.object({
  type: z.enum(['buy', 'sell']),
  orderType: z.enum(['market', 'limit']),
  assetId: z.string().regex(/^asset-[0-9a-fA-F-]+$/),
  assetName: z.string().min(1).max(100),
  assetSymbol: z.string().min(1).max(10),
  assetCategory: z.string().min(1).max(50).optional(),
  assetImage: z.string().url().optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  limitPrice: z.number().positive().optional(),
  expiryDays: z.number().int().min(1).max(30).optional(),
}).refine(
  (data) => data.orderType !== 'limit' || (data.limitPrice !== undefined && data.expiryDays !== undefined),
  { message: 'Limit price and expiry days are required for limit orders' }
);

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
      type: searchParams.get('type'),
      orderType: searchParams.get('orderType'),
      status: searchParams.get('status'),
      assetId: searchParams.get('assetId'),
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

    const { userId, type, orderType, status, assetId, limit, page } = queryResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');

    // Build query
    const query: any = { userId: sanitizeInput(userId) };
    if (type) query.type = type;
    if (orderType) query.orderType = orderType;
    if (status) query.status = status;
    if (assetId) query['asset.id'] = sanitizeInput(assetId);

    // Get total count for pagination
    const totalOrders = await ordersCollection.countDocuments(query);

    // Fetch orders from MongoDB
    const orders = await ordersCollection
      .find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        id: 1,
        type: 1,
        orderType: 1,
        asset: 1,
        quantity: 1,
        price: 1,
        total: 1,
        limitPrice: 1,
        status: 1,
        filledQuantity: 1,
        createdAt: 1,
        expiresAt: 1,
        userId: 1,
        transactionHash: 1,
      })
      .toArray();

    const response: OrdersResponse = {
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages: Math.ceil(totalOrders / limit),
        },
      },
    };

    // Log successful request
    logger.info('Orders fetched', {
      userId,
      type,
      orderType,
      status,
      assetId,
      page,
      limit,
      orderCount: orders.length,
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

    logger.error('Orders error', {
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

    const { type, orderType, assetId, assetName, assetSymbol, assetCategory, assetImage, quantity, price, limitPrice, expiryDays } = bodyResult.data;
    const userId = decodedToken.userId;

    // Connect to database
    const db = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const assetsCollection = db.collection('ip_assets');

    // Verify asset exists
    const asset = await assetsCollection.findOne({ id: sanitizeInput(assetId), userId: sanitizeInput(userId) });
    if (!asset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Calculate total
    const total = quantity * price;

    // Calculate expiry date for limit orders
    let expiresAt: string | undefined;
    if (orderType === 'limit' && expiryDays) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + expiryDays);
      expiresAt = expiry.toISOString();
    }

    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      orderType,
      asset: {
        id: sanitizeInput(assetId),
        name: sanitizeInput(assetName),
        symbol: sanitizeInput(assetSymbol),
        category: assetCategory ? sanitizeInput(assetCategory) : 'Other',
        image: assetImage ? sanitizeInput(assetImage) : undefined,
      },
      quantity,
      price,
      total,
      limitPrice: orderType === 'limit' ? limitPrice : undefined,
      status: orderType === 'market' ? 'filled' : 'open',
      filledQuantity: orderType === 'market' ? quantity : 0,
      createdAt: new Date().toISOString(),
      expiresAt,
      userId: sanitizeInput(userId),
      transactionHash: orderType === 'market' ? `0x${Math.random().toString(16).substring(2, 42)}` : undefined,
    };

    // Save order to database
    await ordersCollection.insertOne(newOrder);

    const response: CreateOrderResponse = {
      success: true,
      data: newOrder,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} order placed successfully`,
    };

    // Log successful request
    logger.info('Order created', {
      userId,
      orderId: newOrder.id,
      type,
      orderType,
      assetId,
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

    logger.error('Create order error', {
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