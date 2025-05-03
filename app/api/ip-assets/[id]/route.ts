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

// Historical price data interface
interface HistoricalPriceData {
  date: string;
  price: number;
}

// Related asset interface
interface RelatedAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  image?: string;
}

// Market data interface
interface MarketData {
  holders: number;
  averageHolding: number;
  liquidityDepth: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  allTimeHigh: number;
  allTimeHighDate: string;
}

// Response interface
interface IPAssetResponse {
  success: boolean;
  data?: {
    asset: IPAsset;
    historicalPriceData: HistoricalPriceData[];
    relatedAssets: RelatedAsset[];
    marketData: MarketData;
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
const paramsSchema = z.object({
  userId: z.string().uuid(),
  id: z.string().regex(/^asset-[0-9a-fA-F-]+$/),
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
    
    const userId = decodedToken.userId;

    if (!paramsResult.success) {
      logger.warn('Invalid parameters', { errors: paramsResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { id } = paramsResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const assetsCollection = db.collection<IPAsset>('ip_assets');

    // Fetch the asset by ID
    const asset = await assetsCollection.findOne({ id: sanitizeInput(id) });

    if (!asset) {
      return NextResponse.json(
        { success: false, message: 'IP asset not found' },
        { status: 404, headers: securityHeaders }
      );
    }

    // Fetch historical price data
    const historicalDataCollection = db.collection('ip_asset_historical_data');
    const rawHistoricalData = await historicalDataCollection
      .find({ assetId: id })
      .sort({ date: 1 })
      .project({
        date: 1,
        price: 1,
        _id: 0,
      })
      .toArray();

    // Convert MongoDB documents to HistoricalPriceData type
    const historicalPriceData: HistoricalPriceData[] = rawHistoricalData.map((item) => ({
      date: item.date as string,
      price: item.price as number,
    }));

    // Fetch related assets (same category)
    const rawRelatedAssets = await assetsCollection
      .find({
        category: asset.category,
        id: { $ne: id },
      })
      .limit(5)
      .project({
        id: 1,
        name: 1,
        symbol: 1,
        price: 1,
        image: 1,
        _id: 0,
      })
      .toArray();

    // Convert MongoDB documents to RelatedAsset type
    const relatedAssets: RelatedAsset[] = rawRelatedAssets.map((item) => ({
      id: item.id as string,
      name: item.name as string,
      symbol: item.symbol as string,
      price: item.price as number,
      image: item.image as string | undefined,
    }));

    // Generate mock historical data if none exists
    if (!historicalPriceData.length) {
      const generatedData = await generateHistoricalPriceData(asset as IPAsset);
      const priceHistoryCollection = db.collection('ip_asset_historical_data');
      await priceHistoryCollection.insertMany(
        generatedData.map((data) => ({
          ...data,
          assetId: id,
          createdAt: new Date(),
        }))
      );

      historicalPriceData.push(...generatedData);
    }

    // Generate market data
    const marketData: MarketData = {
      holders: Math.floor((asset.totalSupply as number) * 0.8),
      averageHolding: Math.floor((asset.totalSupply as number) / ((asset.totalSupply as number) * 0.8)),
      liquidityDepth: (asset.marketCap as number) * 0.3,
      priceChange24h: (asset.performance as any).day,
      priceChange7d: (asset.performance as any).week,
      priceChange30d: (asset.performance as any).month,
      allTimeHigh: (asset.price as number) * 1.2,
      allTimeHighDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * Math.random()).toISOString(),
    };

    const response: IPAssetResponse = {
      success: true,
      data: {
        asset,
        historicalPriceData,
        relatedAssets,
        marketData,
      },
    };

    // Log successful request
    logger.info('IP asset details fetched', {
      userId: userId,
      assetId: id,
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

    logger.error('IP asset details error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

// Helper function to generate historical price data
async function generateHistoricalPriceData(asset: IPAsset): Promise<HistoricalPriceData[]> {
  const now = new Date();
  const startDate = new Date(asset.createdAt);
  const dayDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const priceData: HistoricalPriceData[] = [];
  let currentPrice = asset.price * 0.7; // Start at 70% of current price

  for (let i = 0; i <= dayDiff; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Add some randomness but maintain an upward trend
    const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
    const trendFactor = 1 + (i / dayDiff) * 0.3; // Gradually increase to reach current price

    currentPrice = currentPrice * randomFactor * trendFactor;

    // Ensure we reach the current price at the end
    if (i === dayDiff) {
      currentPrice = asset.price;
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