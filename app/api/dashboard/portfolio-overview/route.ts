import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// Asset category types
type AssetCategory = 'Film' | 'Music' | 'Art' | 'Literature' | 'Gaming' | 'Other';

// Asset interface
interface PortfolioAsset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
  performance: {
    change: number;
    percentage: number;
  };
  roi: number;
  image?: string;
}

// Response interface
interface PortfolioResponse {
  success: boolean;
  data?: {
    assets: PortfolioAsset[];
    metrics: {
      totalValue: number;
      totalInvestment: number;
      totalGain: number;
      totalRoi: number;
      assetCount: number;
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
});

// Headers for security
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
    });

    if (!queryResult.success) {
      logger.warn('Invalid query parameters', { errors: queryResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId } = queryResult.data;

    // Connect to database
    const db = await connectToDatabase();
    
    // Fetch assets from MongoDB
    const assetsCollection = db.collection<PortfolioAsset>('portfolio_assets');
    const assets = await assetsCollection
      .find({ userId: sanitizeInput(userId) })
      .project({
        id: 1,
        name: 1,
        category: 1,
        value: 1,
        quantity: 1,
        purchaseDate: 1,
        purchasePrice: 1,
        performance: 1,
        roi: 1,
        image: 1,
      })
      .toArray();

    if (!assets.length) {
      return NextResponse.json(
        {
          success: true,
          data: {
            assets: [],
            metrics: {
              totalValue: 0,
              totalInvestment: 0,
              totalGain: 0,
              totalRoi: 0,
              assetCount: 0,
            },
            distribution: { categories: [] },
          },
        },
        { headers: securityHeaders }
      );
    }

    // Cast MongoDB Document array to our PortfolioAsset type
    const typedAssets = assets as unknown as PortfolioAsset[];
    
    // Calculate portfolio metrics
    const totalValue = typedAssets.reduce((sum: number, asset) => sum + asset.value, 0);
    const totalInvestment = typedAssets.reduce((sum: number, asset) => sum + asset.purchasePrice, 0);
    const totalGain = totalValue - totalInvestment;
    const totalRoi = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0;

    // Calculate category distribution
    const categoryDistribution = typedAssets.reduce((acc: Record<string, number>, asset) => {
      const category = asset.category;
      acc[category] = (acc[category] || 0) + asset.value;
      return acc;
    }, {} as Record<string, number>);

    // Convert to percentage
    const categoryPercentages = Object.entries(categoryDistribution).map(([category, value]) => ({
      category,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));

    const response: PortfolioResponse = {
      success: true,
      data: {
        assets: typedAssets,
        metrics: {
          totalValue,
          totalInvestment,
          totalGain,
          totalRoi,
          assetCount: assets.length,
        },
        distribution: {
          categories: categoryPercentages,
        },
      },
    };

    // Log performance
    const endTime = Date.now();
    const clientIpAddress = request.headers.get('x-forwarded-for') || 'unknown';
    logger.debug(`Portfolio overview API response time: ${endTime - startTime}ms`, { clientIp: clientIpAddress });

    // Log successful request
    logger.info('Portfolio overview fetched', {
      userId,
      assetCount: assets.length,
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

    logger.error('Portfolio overview error', {
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