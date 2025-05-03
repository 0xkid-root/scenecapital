import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Royalty payment interface
interface RoyaltyPayment {
  id: string;
  platform: string;
  project: string;
  amount: number;
  date: string;
  status: 'processed' | 'pending';
  category: string;
  territory?: string;
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // Default to 30 days
    const platform = searchParams.get('platform');
    const project = searchParams.get('project');
    const territory = searchParams.get('territory');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    // Generate mock data based on the period
    const payments = generateMockPayments(period);
    
    // Filter payments based on query parameters
    let filteredPayments = [...payments];
    
    if (platform) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.platform.toLowerCase() === platform.toLowerCase()
      );
    }
    
    if (project) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.project.toLowerCase() === project.toLowerCase()
      );
    }
    
    if (territory) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.territory?.toLowerCase() === territory.toLowerCase()
      );
    }
    
    if (category) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (status) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.status === status
      );
    }

    // Calculate summary metrics
    const totalIncome = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const processedIncome = filteredPayments
      .filter(payment => payment.status === 'processed')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingIncome = filteredPayments
      .filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate platform distribution
    const platformDistribution = filteredPayments.reduce((acc, payment) => {
      const platform = payment.platform;
      if (!acc[platform]) {
        acc[platform] = 0;
      }
      acc[platform] += payment.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate project distribution
    const projectDistribution = filteredPayments.reduce((acc, payment) => {
      const project = payment.project;
      if (!acc[project]) {
        acc[project] = 0;
      }
      acc[project] += payment.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate category distribution
    const categoryDistribution = filteredPayments.reduce((acc, payment) => {
      const category = payment.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += payment.amount;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        payments: filteredPayments,
        metrics: {
          totalIncome,
          processedIncome,
          pendingIncome,
          paymentCount: filteredPayments.length
        },
        distribution: {
          platforms: Object.entries(platformDistribution).map(([platform, value]) => ({
            platform,
            value,
            percentage: (value / totalIncome) * 100
          })),
          projects: Object.entries(projectDistribution).map(([project, value]) => ({
            project,
            value,
            percentage: (value / totalIncome) * 100
          })),
          categories: Object.entries(categoryDistribution).map(([category, value]) => ({
            category,
            value,
            percentage: (value / totalIncome) * 100
          }))
        }
      }
    });
  } catch (error) {
    console.error('Royalties income error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch royalties income data' },
      { status: 500 }
    );
  }
}

// Helper function to generate mock payments data
function generateMockPayments(period: string): RoyaltyPayment[] {
  const today = new Date();
  let startDate = new Date();
  
  // Set the start date based on the period
  switch (period) {
    case '7d':
      startDate.setDate(today.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(today.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(today.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case 'ytd':
      startDate = new Date(today.getFullYear(), 0, 1); // January 1st of current year
      break;
    default:
      startDate.setDate(today.getDate() - 30);
  }
  
  // Sample data for platforms, projects, categories, and territories
  const platforms = ['Spotify', 'Apple Music', 'Netflix', 'YouTube', 'Amazon', 'Tidal', 'Disney+'];
  const projects = ['Urban Dreamscape', 'Harmonic Waves', 'Digital Renaissance', 'Neon Horizons', 'Ethereal Chronicles'];
  const categories = ['Film', 'Music', 'Art', 'Gaming', 'Literature'];
  const territories = ['Global', 'North America', 'Europe', 'Asia', 'Latin America', 'Oceania'];
  const statuses = ['processed', 'pending'] as const;
  
  // Generate random payments
  const payments: RoyaltyPayment[] = [];
  const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate more payments for longer periods
  const paymentCount = Math.max(10, Math.min(100, dayDiff * 2));
  
  for (let i = 0; i < paymentCount; i++) {
    // Random date between start date and today
    const randomDayOffset = Math.floor(Math.random() * (dayDiff + 1));
    const paymentDate = new Date(startDate);
    paymentDate.setDate(startDate.getDate() + randomDayOffset);
    
    // Random platform, project, category, and territory
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    
    // Match category to project (consistent mapping)
    let category: string;
    if (project === 'Urban Dreamscape') category = 'Film';
    else if (project === 'Harmonic Waves') category = 'Music';
    else if (project === 'Digital Renaissance') category = 'Art';
    else if (project === 'Neon Horizons') category = 'Gaming';
    else category = 'Literature';
    
    const territory = territories[Math.floor(Math.random() * territories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Random amount (more recent payments tend to be higher - simulating growth)
    const baseFactor = 1 + (randomDayOffset / dayDiff);
    const randomFactor = 0.5 + Math.random();
    const amount = parseFloat((100 * baseFactor * randomFactor).toFixed(2));
    
    payments.push({
      id: `payment-${i + 1}`,
      platform,
      project,
      amount,
      date: paymentDate.toISOString(),
      status,
      category,
      territory
    });
  }
  
  // Sort payments by date (newest first)
  return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
