import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Market trend interface
interface MarketTrend {
  category: string;
  marketCap: number;
  volume24h: number;
  change24h: number;
  change7d: number;
  change30d: number;
  avgPrice: number;
  avgRoyaltyRate: number;
  totalAssets: number;
  totalTransactions: number;
}

// Historical data point interface
interface HistoricalDataPoint {
  date: string;
  value: number;
}

// Market trend response interface
interface MarketTrendResponse {
  trends: MarketTrend[];
  historicalData: {
    marketCap: HistoricalDataPoint[];
    volume: HistoricalDataPoint[];
    avgPrice: HistoricalDataPoint[];
  };
  topPerformers: {
    assets: {
      id: string;
      name: string;
      symbol: string;
      category: string;
      price: number;
      change24h: number;
    }[];
    categories: {
      category: string;
      change24h: number;
      marketCap: number;
    }[];
  };
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
    
    // Generate mock market trends data
    const marketTrends: MarketTrend[] = [
      {
        category: 'Film',
        marketCap: 2500000,
        volume24h: 125000,
        change24h: 2.3,
        change7d: 5.8,
        change30d: 15.2,
        avgPrice: 5000,
        avgRoyaltyRate: 12.5,
        totalAssets: 50,
        totalTransactions: 120
      },
      {
        category: 'Music',
        marketCap: 1800000,
        volume24h: 95000,
        change24h: 1.2,
        change7d: 3.5,
        change30d: 9.7,
        avgPrice: 2500,
        avgRoyaltyRate: 8.75,
        totalAssets: 72,
        totalTransactions: 180
      },
      {
        category: 'Art',
        marketCap: 3200000,
        volume24h: 160000,
        change24h: 3.1,
        change7d: 7.5,
        change30d: 18.4,
        avgPrice: 7500,
        avgRoyaltyRate: 15.2,
        totalAssets: 42,
        totalTransactions: 95
      },
      {
        category: 'Gaming',
        marketCap: 4100000,
        volume24h: 205000,
        change24h: 1.8,
        change7d: 4.2,
        change30d: 12.3,
        avgPrice: 3000,
        avgRoyaltyRate: 10.5,
        totalAssets: 135,
        totalTransactions: 310
      },
      {
        category: 'Literature',
        marketCap: 950000,
        volume24h: 47500,
        change24h: 0.9,
        change7d: 2.8,
        change30d: 6.5,
        avgPrice: 1500,
        avgRoyaltyRate: 7.5,
        totalAssets: 63,
        totalTransactions: 125
      }
    ];
    
    // Generate historical data based on period
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    
    // Generate historical market cap data
    const marketCapHistory = generateHistoricalData(days, 12500000, 0.2, 0.1);
    
    // Generate historical volume data
    const volumeHistory = generateHistoricalData(days, 625000, 0.3, 0.15);
    
    // Generate historical average price data
    const avgPriceHistory = generateHistoricalData(days, 3900, 0.15, 0.08);
    
    // Generate top performers
    const topAssets = [
      {
        id: 'asset-003',
        name: 'Digital Renaissance',
        symbol: 'RENAI',
        category: 'Art',
        price: 7500,
        change24h: 3.1
      },
      {
        id: 'asset-001',
        name: 'Urban Dreamscape',
        symbol: 'DREAM',
        category: 'Film',
        price: 5000,
        change24h: 2.3
      },
      {
        id: 'asset-004',
        name: 'Neon Horizons',
        symbol: 'NEON',
        category: 'Gaming',
        price: 3000,
        change24h: 1.8
      },
      {
        id: 'asset-002',
        name: 'Harmonic Waves',
        symbol: 'WAVE',
        category: 'Music',
        price: 2500,
        change24h: 1.2
      },
      {
        id: 'asset-005',
        name: 'Ethereal Chronicles',
        symbol: 'ETHER',
        category: 'Literature',
        price: 1500,
        change24h: 0.9
      }
    ];
    
    // Sort categories by 24h change
    const topCategories = marketTrends
      .map(trend => ({
        category: trend.category,
        change24h: trend.change24h,
        marketCap: trend.marketCap
      }))
      .sort((a, b) => b.change24h - a.change24h);

    const response: MarketTrendResponse = {
      trends: marketTrends,
      historicalData: {
        marketCap: marketCapHistory,
        volume: volumeHistory,
        avgPrice: avgPriceHistory
      },
      topPerformers: {
        assets: topAssets,
        categories: topCategories
      }
    };

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Market trends error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch market trends' },
      { status: 500 }
    );
  }
}

// Helper function to generate historical data
function generateHistoricalData(
  days: number,
  currentValue: number,
  volatility: number,
  trend: number
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  let value = currentValue * (1 - trend * days / 365); // Start with lower value
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Add random volatility but maintain an upward trend
    const randomFactor = 1 - volatility / 2 + Math.random() * volatility;
    const trendFactor = 1 + trend / days;
    
    value = value * randomFactor * trendFactor;
    
    // Ensure we reach the current value at the end
    if (i === 0) {
      value = currentValue;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return data;
}
