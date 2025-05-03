import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
    
    // Mock royalty summary data
    const summary = {
      totalEarnings: {
        ytd: 124567.89,
        thisMonth: 24839.45,
        lastMonth: 22935.78,
        change: {
          value: 1903.67,
          percentage: 8.3
        }
      },
      activeProjects: 27,
      topPerformers: [
        {
          id: 'project-001',
          name: 'Urban Dreamscape',
          category: 'Film',
          earnings: 45230.50,
          change: 15.2
        },
        {
          id: 'project-002',
          name: 'Harmonic Waves',
          category: 'Music',
          earnings: 28750.25,
          change: 9.7
        },
        {
          id: 'project-003',
          name: 'Digital Renaissance',
          category: 'Art',
          earnings: 22500.00,
          change: 18.4
        }
      ],
      platformDistribution: [
        {
          platform: 'Spotify',
          earnings: 35250.75,
          percentage: 28.3
        },
        {
          platform: 'Apple Music',
          earnings: 27890.45,
          percentage: 22.4
        },
        {
          platform: 'Netflix',
          earnings: 22450.30,
          percentage: 18.0
        },
        {
          platform: 'YouTube',
          earnings: 18750.25,
          percentage: 15.1
        },
        {
          platform: 'Others',
          earnings: 20226.14,
          percentage: 16.2
        }
      ],
      recentPayments: [
        {
          id: 'payment-001',
          platform: 'Spotify',
          amount: 1245.32,
          date: new Date().toISOString(),
          status: 'processed',
          project: 'Harmonic Waves'
        },
        {
          id: 'payment-002',
          platform: 'Apple Music',
          amount: 876.19,
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          status: 'pending',
          project: 'Harmonic Waves'
        },
        {
          id: 'payment-003',
          platform: 'Netflix',
          amount: 2350.45,
          date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          status: 'processed',
          project: 'Urban Dreamscape'
        }
      ],
      forecast: {
        nextMonth: 26500.00,
        nextQuarter: 78900.00,
        changePercentage: 6.7
      },
      historicalData: generateHistoricalData(period)
    };

    return NextResponse.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Royalties summary error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch royalties summary' },
      { status: 500 }
    );
  }
}

// Helper function to generate historical data based on period
function generateHistoricalData(period: string) {
  const today = new Date();
  let startDate = new Date();
  let dataPoints: { date: string; value: number }[] = [];
  
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

  // Generate daily data points from start date to today
  const baseValue = 800; // Base daily value
  const volatility = 0.3; // Daily volatility for random fluctuations
  const uptrend = 0.02; // Small upward trend
  
  // Loop through each day and generate a data point
  for (let d = new Date(startDate); d.getTime() <= today.getTime(); d.setDate(d.getDate() + 1)) {
    const dayOffset = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const trendFactor = 1 + (dayOffset * uptrend);
    const randomFactor = 1 + ((Math.random() * 2 - 1) * volatility);
    
    const value = baseValue * trendFactor * randomFactor;
    
    dataPoints.push({
      date: d.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return dataPoints;
}
