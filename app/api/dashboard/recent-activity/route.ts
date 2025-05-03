import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// Activity types
type ActivityType = 
  | 'royalty_payment'
  | 'licensing_deal'
  | 'investment'
  | 'order'
  | 'project_update'
  | 'contract_signed';

// Activity status
type ActivityStatus = 
  | 'completed'
  | 'pending'
  | 'processing'
  | 'failed'
  | 'active';

// Activity interface
interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount?: number;
  date: string;
  status: ActivityStatus;
  entity?: {
    id: string;
    name: string;
    image?: string;
  };
}

// Response interface
interface ActivityResponse {
  success: boolean;
  data?: {
    activities: Activity[];
    pagination: {
      page: number;
      limit: number;
      totalActivities: number;
      totalPages: number;
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
  limit: z.number().int().min(1).max(100).default(10),
  page: z.number().int().min(1).default(1),
  type: z
    .enum(['royalty_payment', 'licensing_deal', 'investment', 'order', 'project_update', 'contract_signed'])
    .optional(),
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
      limit: parseInt(searchParams.get('limit') || '10'),
      page: parseInt(searchParams.get('page') || '1'),
      type: searchParams.get('type'),
    });

    if (!queryResult.success) {
      logger.warn('Invalid query parameters', { errors: queryResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, limit, page, type } = queryResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const activitiesCollection = db.collection<Activity>('activities');

    // Build query
    const query: any = { userId: sanitizeInput(userId) };
    if (type) {
      query.type = sanitizeInput(type);
    }

    // Get total count for pagination
    const totalActivities = await activitiesCollection.countDocuments(query);

    // Fetch activities from MongoDB
    const rawActivities = await activitiesCollection
      .find(query)
      .sort({ date: -1 }) // Sort by date descending
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        id: 1,
        type: 1,
        title: 1,
        description: 1,
        amount: 1,
        date: 1,
        status: 1,
        entity: 1,
      })
      .toArray();
      
    // Convert MongoDB documents to Activity type
    const activities: Activity[] = rawActivities.map(item => ({
      id: item.id as string,
      type: item.type as ActivityType,
      title: item.title as string,
      description: item.description as string,
      amount: item.amount as number | undefined,
      date: item.date as string,
      status: item.status as ActivityStatus,
      entity: item.entity as { id: string; name: string; image?: string } | undefined
    }));

    // Calculate total pages
    const totalPages = Math.ceil(totalActivities / limit);

    const response: ActivityResponse = {
      success: true,
      data: {
        activities,
        pagination: {
          page,
          limit,
          totalActivities,
          totalPages,
        },
      },
    };

    // Log successful request
    logger.info('Recent activity data fetched', {
      userId,
      type,
      page,
      limit,
      activityCount: activities.length,
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

    logger.error('Recent activity error', {
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