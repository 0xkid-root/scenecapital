import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// Interfaces
interface TopPerformer {
  id: string;
  name: string;
  category: string;
  value: number;
  change: number;
}

interface RecentActivity {
  id: string;
  type: 'royalty_payment' | 'licensing_deal';
  platform?: string;
  company?: string;
  amount: number;
  date: string;
  status: 'processed' | 'active';
}

interface DashboardSummary {
  portfolioValue: number;
  portfolioChange: number;
  activeProjects: number;
  activeDeals: number;
  pendingDeals: number;
  royaltiesThisMonth: number;
  royaltiesChange: number;
  topPerformers: TopPerformer[];
  recentActivity: RecentActivity[];
}

interface DashboardResponse {
  success: boolean;
  data?: DashboardSummary;
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

    // Fetch portfolio data
    const portfolioCollection = db.collection('portfolio_values');
    const latestPortfolio = await portfolioCollection
      .find({ userId: sanitizeInput(userId) })
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    // Fetch project data
    const projectsCollection = db.collection('projects');
    const activeProjectsCount = await projectsCollection.countDocuments({
      userId: sanitizeInput(userId),
      status: { $in: ['funding', 'in_progress'] },
    });

    // Fetch deals data
    const dealsCollection = db.collection('deals');
    const activeDealsCount = await dealsCollection.countDocuments({
      userId: sanitizeInput(userId),
      status: 'active',
    });
    const pendingDealsCount = await dealsCollection.countDocuments({
      userId: sanitizeInput(userId),
      status: 'pending',
    });

    // Fetch royalties data
    const royaltiesCollection = db.collection('royalties');
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const royaltiesThisMonth = await royaltiesCollection
      .aggregate([
        {
          $match: {
            userId: sanitizeInput(userId),
            date: { $regex: `^${currentMonth}` },
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    // Fetch previous month's royalties for change calculation
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);
    const royaltiesLastMonth = await royaltiesCollection
      .aggregate([
        {
          $match: {
            userId: sanitizeInput(userId),
            date: { $regex: `^${lastMonthStr}` },
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    // Fetch top performers
    const assetsCollection = db.collection('portfolio_assets');
    const topPerformers = await assetsCollection
      .find({ userId: sanitizeInput(userId) })
      .sort({ 'performance.percentage': -1 })
      .limit(2)
      .project({
        id: 1,
        name: 1,
        category: 1,
        value: 1,
        'performance.percentage': 1,
      })
      .toArray();

    // Fetch recent activities
    const activitiesCollection = db.collection('activities');
    const recentActivity = await activitiesCollection
      .find({
        userId: sanitizeInput(userId),
        type: { $in: ['royalty_payment', 'licensing_deal'] },
      })
      .sort({ date: -1 })
      .limit(2)
      .project({
        id: 1,
        type: 1,
        'entity.name': 1,
        amount: 1,
        date: 1,
        status: 1,
      })
      .toArray();

    // Calculate portfolio change
    const portfolioValue = latestPortfolio[0]?.value || 0;
    const previousPortfolio = await portfolioCollection
      .find({ userId: sanitizeInput(userId) })
      .sort({ date: -1 })
      .skip(1)
      .limit(1)
      .toArray();
    const previousValue = previousPortfolio[0]?.value || portfolioValue;
    const portfolioChange = previousValue > 0 ? ((portfolioValue - previousValue) / previousValue) * 100 : 0;

    // Calculate royalties change
    const currentRoyalties = royaltiesThisMonth[0]?.total || 0;
    const previousRoyalties = royaltiesLastMonth[0]?.total || 0;
    const royaltiesChange = previousRoyalties > 0 ? ((currentRoyalties - previousRoyalties) / previousRoyalties) * 100 : 0;

    const response: DashboardResponse = {
      success: true,
      data: {
        portfolioValue: Number(portfolioValue.toFixed(2)),
        portfolioChange: Number(portfolioChange.toFixed(2)),
        activeProjects: activeProjectsCount,
        activeDeals: activeDealsCount,
        pendingDeals: pendingDealsCount,
        royaltiesThisMonth: Number(currentRoyalties.toFixed(2)),
        royaltiesChange: Number(royaltiesChange.toFixed(2)),
        topPerformers: topPerformers.map((asset) => ({
          id: asset.id,
          name: asset.name,
          category: asset.category,
          value: asset.value,
          change: asset.performance.percentage,
        })),
        recentActivity: recentActivity.map((activity) => ({
          id: activity.id,
          type: activity.type,
          platform: activity.type === 'royalty_payment' ? activity.entity?.name : undefined,
          company: activity.type === 'licensing_deal' ? activity.entity?.name : undefined,
          amount: activity.amount,
          date: activity.date,
          status: activity.status,
        })),
      },
    };

    // Log successful request
    logger.info('Dashboard summary fetched', {
      userId,
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

    logger.error('Dashboard summary error', {
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