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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // Find the investment by ID
    const investment = investments.find(i => i.id === id);
    
    if (!investment) {
      return NextResponse.json(
        { success: false, message: 'Investment not found' },
        { status: 404 }
      );
    }

    // Generate performance history
    const performanceHistory = generatePerformanceHistory(investment);
    
    // Generate rewards history for blockchain investments
    const rewardsHistory = investment.type === 'blockchain' 
      ? generateRewardsHistory(investment) 
      : null;
    
    // Get similar investments (same category)
    const similarInvestments = investments
      .filter(i => i.category === investment.category && i.id !== investment.id)
      .map(i => ({
        id: i.id,
        name: i.name,
        type: i.type,
        amount: i.amount,
        returns: i.returns
      }));

    return NextResponse.json({
      success: true,
      data: {
        investment,
        performanceHistory,
        rewardsHistory,
        similarInvestments
      }
    });
  } catch (error) {
    console.error('Get investment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch investment details' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // Find the investment by ID
    const investment = investments.find(i => i.id === id);
    
    if (!investment) {
      return NextResponse.json(
        { success: false, message: 'Investment not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const { action, amount } = body;
    
    // Validate action
    if (!['invest', 'withdraw', 'claim_rewards'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }
    
    // Validate amount for invest and withdraw actions
    if (['invest', 'withdraw'].includes(action) && (!amount || amount <= 0)) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required' },
        { status: 400 }
      );
    }
    
    // Process action
    let result;
    
    if (action === 'invest') {
      // For blockchain investments, calculate tokens based on current price
      if (investment.type === 'blockchain' && investment.asset) {
        const tokenPrice = investment.amount / (investment.userTokens || 1);
        const newTokens = amount / tokenPrice;
        
        result = {
          previousInvestment: investment.userInvestment || 0,
          newInvestment: (investment.userInvestment || 0) + amount,
          previousTokens: investment.userTokens || 0,
          newTokens: (investment.userTokens || 0) + newTokens,
          transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`
        };
      } else {
        // For traditional investments
        result = {
          previousInvestment: investment.amount,
          newInvestment: investment.amount + amount,
          transactionId: `TRX-${Date.now()}`
        };
      }
    } else if (action === 'withdraw') {
      // Validate withdrawal amount
      if (investment.type === 'blockchain') {
        if (!investment.userInvestment || amount > investment.userInvestment) {
          return NextResponse.json(
            { success: false, message: 'Withdrawal amount exceeds your investment' },
            { status: 400 }
          );
        }
        
        const tokenPrice = investment.amount / (investment.userTokens || 1);
        const tokensToWithdraw = amount / tokenPrice;
        
        result = {
          previousInvestment: investment.userInvestment,
          newInvestment: investment.userInvestment - amount,
          previousTokens: investment.userTokens || 0,
          newTokens: (investment.userTokens || 0) - tokensToWithdraw,
          transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`
        };
      } else {
        // For traditional investments
        if (amount > investment.amount) {
          return NextResponse.json(
            { success: false, message: 'Withdrawal amount exceeds investment amount' },
            { status: 400 }
          );
        }
        
        result = {
          previousInvestment: investment.amount,
          newInvestment: investment.amount - amount,
          transactionId: `TRX-${Date.now()}`
        };
      }
    } else if (action === 'claim_rewards') {
      // Only blockchain investments can claim rewards
      if (investment.type !== 'blockchain' || !investment.rewards) {
        return NextResponse.json(
          { success: false, message: 'No rewards available to claim' },
          { status: 400 }
        );
      }
      
      result = {
        claimedAmount: investment.rewards,
        transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        result,
        message: `${action.charAt(0).toUpperCase() + action.slice(1).replace('_', ' ')} successful`
      }
    });
  } catch (error) {
    console.error('Investment action error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process investment action' },
      { status: 500 }
    );
  }
}

// Helper function to generate performance history
function generatePerformanceHistory(investment: Investment) {
  const now = new Date();
  const startDate = new Date(investment.investmentDate);
  const monthDiff = (now.getMonth() - startDate.getMonth()) + 
                    (now.getFullYear() - startDate.getFullYear()) * 12;
  
  const performanceData = [];
  let currentValue = investment.amount * 0.9; // Start at 90% of current amount
  
  for (let i = 0; i <= monthDiff; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    
    // Add some randomness but maintain an upward trend
    const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
    const trendFactor = 1 + (i / Math.max(1, monthDiff)) * 0.1; // Gradually increase
    
    currentValue = currentValue * randomFactor * trendFactor;
    
    // Ensure we reach the current amount at the end
    if (i === monthDiff) {
      currentValue = investment.amount;
    }
    
    const monthlyReturn = (currentValue / investment.amount - 1) * 100;
    
    performanceData.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2)),
      returns: parseFloat(monthlyReturn.toFixed(2))
    });
  }
  
  return performanceData;
}

// Helper function to generate rewards history for blockchain investments
function generateRewardsHistory(investment: Investment) {
  if (investment.type !== 'blockchain' || !investment.rewardsRate) {
    return null;
  }
  
  const now = new Date();
  const startDate = new Date(investment.investmentDate);
  const monthDiff = (now.getMonth() - startDate.getMonth()) + 
                    (now.getFullYear() - startDate.getFullYear()) * 12;
  
  const rewardsData = [];
  let totalRewards = 0;
  
  for (let i = 0; i <= monthDiff; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    
    // Calculate monthly rewards based on investment amount and rewards rate
    const baseRewards = (investment.userInvestment || 0) * (investment.rewardsRate / 100) / 12;
    
    // Add some randomness
    const randomFactor = 0.9 + Math.random() * 0.2; // Random between 0.9 and 1.1
    const monthlyRewards = baseRewards * randomFactor;
    
    totalRewards += monthlyRewards;
    
    rewardsData.push({
      date: date.toISOString().split('T')[0],
      rewards: parseFloat(monthlyRewards.toFixed(2)),
      totalRewards: parseFloat(totalRewards.toFixed(2))
    });
  }
  
  return rewardsData;
}
