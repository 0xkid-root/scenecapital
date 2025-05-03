import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Investment interface
interface Investment {
  id: string;
  name: string;
  type: 'traditional' | 'blockchain';
  category: string;
  amount: number;
  returns: number;
  status: 'active' | 'completed';
  location?: string;
  investmentDate: string;
  endDate?: string;
  asset?: {
    id: string;
    name: string;
    symbol: string;
    image?: string;
  };
  contractAddress?: string;
  userInvestment?: number;
  userTokens?: number;
  rewards?: number;
  rewardsRate?: number;
  metadata?: {
    [key: string]: any;
  };
}

// Mock investments data
const investments: Investment[] = [
  // Traditional IP investments
  {
    id: 'investment-001',
    name: 'Urban Heights Development',
    type: 'traditional',
    category: 'Film',
    amount: 25000,
    returns: 15.4,
    status: 'active',
    location: 'Global Distribution',
    investmentDate: '2025-01-15',
    metadata: {
      director: 'Alex Rivera',
      studio: 'Dreamscape Productions',
      releaseDate: '2025-06-01',
      distributionChannels: ['Theaters', 'Streaming', 'VOD']
    }
  },
  {
    id: 'investment-002',
    name: 'Tech Park Office Complex',
    type: 'traditional',
    category: 'Music',
    amount: 15000,
    returns: 12.8,
    status: 'active',
    location: 'Global Streaming',
    investmentDate: '2025-02-20',
    metadata: {
      artist: 'Melody Chen',
      label: 'Harmony Records',
      releaseDate: '2025-03-15',
      platforms: ['Spotify', 'Apple Music', 'Amazon Music']
    }
  },
  {
    id: 'investment-003',
    name: 'Retail Plaza',
    type: 'traditional',
    category: 'Art',
    amount: 10000,
    returns: 8.5,
    status: 'active',
    location: 'Digital Galleries',
    investmentDate: '2025-03-10',
    metadata: {
      artist: 'Jordan Taylor',
      gallery: 'Digital Renaissance Gallery',
      exhibition: 'Neo-Renaissance Collection',
      pieces: 12
    }
  },
  
  // Blockchain IP investments
  {
    id: 'investment-004',
    name: 'Urban Dreamscape',
    type: 'blockchain',
    category: 'Film',
    amount: 45000,
    returns: 18.2,
    status: 'active',
    investmentDate: '2025-01-20',
    asset: {
      id: 'asset-001',
      name: 'Urban Dreamscape',
      symbol: 'DREAM',
      image: '/assets/film1.jpg'
    },
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    userInvestment: 5000,
    userTokens: 1,
    rewards: 250,
    rewardsRate: 12.5,
    metadata: {
      tokenType: 'ERC-1155',
      network: 'Ethereum',
      totalHolders: 75,
      royaltyDistribution: 'Quarterly'
    }
  },
  {
    id: 'investment-005',
    name: 'Harmonic Waves',
    type: 'blockchain',
    category: 'Music',
    amount: 28500,
    returns: 14.3,
    status: 'active',
    investmentDate: '2025-02-15',
    asset: {
      id: 'asset-002',
      name: 'Harmonic Waves',
      symbol: 'WAVE',
      image: '/assets/music1.jpg'
    },
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    userInvestment: 2500,
    userTokens: 1,
    rewards: 120,
    rewardsRate: 8.75,
    metadata: {
      tokenType: 'ERC-1155',
      network: 'Polygon',
      totalHolders: 40,
      royaltyDistribution: 'Monthly'
    }
  },
  {
    id: 'investment-006',
    name: 'Digital Renaissance',
    type: 'blockchain',
    category: 'Art',
    amount: 22500,
    returns: 20.1,
    status: 'active',
    investmentDate: '2025-03-05',
    asset: {
      id: 'asset-003',
      name: 'Digital Renaissance',
      symbol: 'RENAI',
      image: '/assets/art1.jpg'
    },
    contractAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
    userInvestment: 7500,
    userTokens: 1,
    rewards: 380,
    rewardsRate: 15.2,
    metadata: {
      tokenType: 'ERC-721',
      network: 'Ethereum',
      totalHolders: 25,
      royaltyDistribution: 'Quarterly'
    }
  }
];

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
    const type = searchParams.get('type') as 'traditional' | 'blockchain' | null;
    const category = searchParams.get('category');
    const status = searchParams.get('status') as 'active' | 'completed' | null;
    const sortBy = searchParams.get('sortBy') || 'investmentDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Filter investments based on query parameters
    let filteredInvestments = [...investments];
    
    if (type) {
      filteredInvestments = filteredInvestments.filter(investment => investment.type === type);
    }
    
    if (category) {
      filteredInvestments = filteredInvestments.filter(investment => 
        investment.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (status) {
      filteredInvestments = filteredInvestments.filter(investment => investment.status === status);
    }
    
    // Sort investments
    filteredInvestments.sort((a, b) => {
      const aValue = a[sortBy as keyof Investment];
      const bValue = b[sortBy as keyof Investment];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    // Calculate summary metrics
    const totalInvestment = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);
    const totalReturns = filteredInvestments.reduce((sum, investment) => sum + (investment.amount * investment.returns / 100), 0);
    const averageReturn = filteredInvestments.reduce((sum, investment) => sum + investment.returns, 0) / filteredInvestments.length;
    
    // Calculate category distribution
    const categoryDistribution = filteredInvestments.reduce((acc, investment) => {
      const category = investment.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += investment.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate type distribution
    const typeDistribution = filteredInvestments.reduce((acc, investment) => {
      const type = investment.type;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += investment.amount;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        investments: filteredInvestments,
        metrics: {
          totalInvestment,
          totalReturns,
          averageReturn,
          investmentCount: filteredInvestments.length
        },
        distribution: {
          categories: Object.entries(categoryDistribution).map(([category, value]) => ({
            category,
            value,
            percentage: (value / totalInvestment) * 100
          })),
          types: Object.entries(typeDistribution).map(([type, value]) => ({
            type,
            value,
            percentage: (value / totalInvestment) * 100
          }))
        }
      }
    });
  } catch (error) {
    console.error('Investments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}
