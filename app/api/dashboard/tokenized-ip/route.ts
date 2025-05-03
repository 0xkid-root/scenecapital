import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// IP Token interface
interface IPToken {
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
}

// Response interface
interface TokenizedIPResponse {
  success: boolean;
  data?: {
    tokens: IPToken[];
    metrics: {
      totalTokens: number;
      totalMarketCap: number;
      totalTradingVolume: number;
      averageRoyaltyRate: number;
    };
    distribution: {
      categories: Array<{
        category: string;
        value: number;
        percentage: number;
      }>;
    };
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
  sort: z.enum(['marketCap', 'price', 'royaltyRate', 'tradingVolume', 'name']).default('marketCap'),
  order: z.enum(['asc', 'desc']).default('desc'),
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
      sort: searchParams.get('sort'),
      order: searchParams.get('order'),
    });

    if (!queryResult.success) {
      logger.warn('Invalid query parameters', { errors: queryResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, category, sort, order } = queryResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const tokensCollection = db.collection<IPToken>('ip_tokens');

    // Build query
    const query: any = { userId: sanitizeInput(userId) };
    if (category) {
      query.category = sanitizeInput(category);
    }

    // Fetch tokens from MongoDB
    const tokens = await tokensCollection
      .find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
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
      })
      .toArray();

    if (!tokens.length) {
      return NextResponse.json(
        {
          success: true,
          data: {
            tokens: [],
            metrics: {
              totalTokens: 0,
              totalMarketCap: 0,
              totalTradingVolume: 0,
              averageRoyaltyRate: 0,
            },
            distribution: { categories: [] },
          },
        },
        { headers: securityHeaders }
      );
    }

    // Calculate market metrics
    const totalMarketCap = tokens.reduce((sum: number, token) => sum + (token.marketCap as number), 0);
    const totalTradingVolume = tokens.reduce((sum: number, token) => sum + (token.tradingVolume as number), 0);
    const averageRoyaltyRate = tokens.reduce((sum: number, token) => sum + (token.royaltyRate as number), 0) / tokens.length;

    // Calculate category distribution
    const categoryDistribution = tokens.reduce((acc: Record<string, number>, token) => {
      const category = token.category as string;
      acc[category] = (acc[category] || 0) + (token.marketCap as number);
      return acc;
    }, {} as Record<string, number>);

    const response: TokenizedIPResponse = {
      success: true,
      data: {
        tokens: tokens as unknown as IPToken[],
        metrics: {
          totalTokens: tokens.length,
          totalMarketCap,
          totalTradingVolume,
          averageRoyaltyRate,
        },
        distribution: {
          categories: Object.entries(categoryDistribution).map(([category, value]) => ({
            category,
            value: value as number,
            percentage: (value / totalMarketCap) * 100,
          })),
        },
      },
    };

    // Log successful request
    const endTime = Date.now();
    const clientIpAddress = request.headers.get('x-forwarded-for') || 'unknown';
    logger.debug(`Tokenized IP API response time: ${endTime - startTime}ms`, { clientIp: clientIpAddress });

    logger.info('Tokenized IP data fetched', {
      userId,
      category,
      sort,
      order,
      tokenCount: tokens.length,
      duration: endTime - startTime,
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

    logger.error('Tokenized IP error', {
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