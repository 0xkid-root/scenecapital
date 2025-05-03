import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, Db } from 'mongodb';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { sanitizeInput } from '@/lib/sanitizer';

// Project status types
type ProjectStatus = 'funding' | 'funded' | 'in_progress' | 'completed';

// Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  backers: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  image?: string;
  highlights?: string[];
}

// Response interface
interface ProjectFundingResponse {
  success: boolean;
  data?: {
    projects: Project[];
    metrics: {
      totalProjects: number;
      totalFundingGoal: number;
      totalCurrentFunding: number;
      totalBackers: number;
      fundingPercentage: number;
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
  status: z.enum(['funding', 'funded', 'in_progress', 'completed']).optional(),
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
      status: searchParams.get('status'),
    });

    if (!queryResult.success) {
      logger.warn('Invalid query parameters', { errors: queryResult.error });
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400, headers: securityHeaders }
      );
    }

    const { userId, status } = queryResult.data;

    // Connect to database
    const db = await connectToDatabase();
    const projectsCollection = db.collection<Project>('projects');

    // Build query
    const query: any = { userId: sanitizeInput(userId) };
    if (status) {
      query.status = sanitizeInput(status);
    }

    // Fetch projects from MongoDB
    const projects = await projectsCollection
      .find(query)
      .project({
        id: 1,
        name: 1,
        description: 1,
        creator: 1,
        category: 1,
        fundingGoal: 1,
        currentFunding: 1,
        backers: 1,
        startDate: 1,
        endDate: 1,
        status: 1,
        image: 1,
        highlights: 1,
      })
      .toArray();

    if (!projects.length) {
      return NextResponse.json(
        {
          success: true,
          data: {
            projects: [],
            metrics: {
              totalProjects: 0,
              totalFundingGoal: 0,
              totalCurrentFunding: 0,
              totalBackers: 0,
              fundingPercentage: 0,
            },
            distribution: { categories: [] },
          },
        },
        { headers: securityHeaders }
      );
    }

    // Cast MongoDB Document array to our Project type
    const typedProjects = projects as unknown as Project[];
    
    // Calculate funding metrics
    const totalProjects = typedProjects.length;
    const totalFundingGoal = typedProjects.reduce((sum: number, project) => sum + project.fundingGoal, 0);
    const totalCurrentFunding = typedProjects.reduce((sum: number, project) => sum + project.currentFunding, 0);
    const totalBackers = typedProjects.reduce((sum: number, project) => sum + project.backers, 0);
    const fundingPercentage = totalFundingGoal > 0 ? (totalCurrentFunding / totalFundingGoal) * 100 : 0;

    // Calculate category distribution
    const categoryDistribution = typedProjects.reduce((acc: Record<string, number>, project) => {
      const category = project.category;
      acc[category] = (acc[category] || 0) + project.currentFunding;
      return acc;
    }, {} as Record<string, number>);

    const categoryPercentages = Object.entries(categoryDistribution).map(([category, value]) => ({
      category,
      value,
      percentage: totalCurrentFunding > 0 ? (value / totalCurrentFunding) * 100 : 0,
    }));

    const response: ProjectFundingResponse = {
      success: true,
      data: {
        projects: typedProjects,
        metrics: {
          totalProjects,
          totalFundingGoal,
          totalCurrentFunding,
          totalBackers,
          fundingPercentage: Number(fundingPercentage.toFixed(2)),
        },
        distribution: {
          categories: categoryPercentages,
        },
      },
    };

    // Log performance
    const endTime = Date.now();
    const clientIpAddress = request.headers.get('x-forwarded-for') || 'unknown';
    logger.debug(`Project funding API response time: ${endTime - startTime}ms`, { clientIp: clientIpAddress });

    // Log successful request
    logger.info('Project funding data fetched', {
      userId,
      status,
      projectCount: projects.length,
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

    logger.error('Project funding error', {
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