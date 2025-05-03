import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Transaction interface
interface RoyaltyTransaction {
  id: string;
  type: 'payment' | 'withdrawal' | 'distribution' | 'adjustment';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  platform?: string;
  project?: string;
  recipient?: string;
  reference?: string;
  category?: string;
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type') as 'payment' | 'withdrawal' | 'distribution' | 'adjustment' | null;
    const status = searchParams.get('status') as 'completed' | 'pending' | 'failed' | null;
    const project = searchParams.get('project');
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Generate mock transactions
    const transactions = generateMockTransactions();
    
    // Filter transactions based on query parameters
    let filteredTransactions = [...transactions];
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(transaction => transaction.type === type);
    }
    
    if (status) {
      filteredTransactions = filteredTransactions.filter(transaction => transaction.status === status);
    }
    
    if (project) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.project?.toLowerCase().includes(project.toLowerCase())
      );
    }
    
    if (platform) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.platform?.toLowerCase().includes(platform.toLowerCase())
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      filteredTransactions = filteredTransactions.filter(transaction => 
        new Date(transaction.date) >= start
      );
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      filteredTransactions = filteredTransactions.filter(transaction => 
        new Date(transaction.date) <= end
      );
    }
    
    // Calculate total count for pagination
    const totalTransactions = filteredTransactions.length;
    const totalPages = Math.ceil(totalTransactions / limit);
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    // Calculate summary metrics
    const totalIncoming = filteredTransactions
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalOutgoing = filteredTransactions
      .filter(t => t.type === 'withdrawal' || t.type === 'distribution')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netAmount = totalIncoming - totalOutgoing;
    
    const pendingAmount = filteredTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        pagination: {
          page,
          limit,
          totalTransactions,
          totalPages
        },
        summary: {
          totalIncoming,
          totalOutgoing,
          netAmount,
          pendingAmount
        }
      }
    });
  } catch (error) {
    console.error('Royalty transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch royalty transactions' },
      { status: 500 }
    );
  }
}

// Helper function to generate mock transactions
function generateMockTransactions(): RoyaltyTransaction[] {
  const now = new Date();
  const transactions: RoyaltyTransaction[] = [];
  
  // Sample data
  const platforms = ['Spotify', 'Apple Music', 'Netflix', 'YouTube', 'Amazon', 'Tidal', 'Disney+'];
  const projects = ['Urban Dreamscape', 'Harmonic Waves', 'Digital Renaissance', 'Neon Horizons', 'Ethereal Chronicles'];
  const categories = ['Film', 'Music', 'Art', 'Gaming', 'Literature'];
  const statuses = ['completed', 'pending', 'failed'] as const;
  const types = ['payment', 'withdrawal', 'distribution', 'adjustment'] as const;
  
  // Generate 50 random transactions over the past 90 days
  for (let i = 0; i < 50; i++) {
    // Random date in the past 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const transactionDate = new Date(now);
    transactionDate.setDate(now.getDate() - daysAgo);
    
    // Random type
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Random status (payments more likely to be completed)
    let status: typeof statuses[number];
    if (type === 'payment') {
      const rand = Math.random();
      status = rand < 0.8 ? 'completed' : (rand < 0.95 ? 'pending' : 'failed');
    } else {
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    // Random amount (based on type)
    let amount: number;
    if (type === 'payment') {
      amount = parseFloat((100 + Math.random() * 1000).toFixed(2));
    } else if (type === 'withdrawal') {
      amount = parseFloat((500 + Math.random() * 2000).toFixed(2));
    } else if (type === 'distribution') {
      amount = parseFloat((200 + Math.random() * 800).toFixed(2));
    } else {
      // Adjustments can be positive or negative
      amount = parseFloat((Math.random() * 200 - 100).toFixed(2));
    }
    
    // Random platform and project (only for payments)
    const platform = type === 'payment' ? platforms[Math.floor(Math.random() * platforms.length)] : undefined;
    const project = ['payment', 'distribution'].includes(type) ? projects[Math.floor(Math.random() * projects.length)] : undefined;
    
    // Match category to project (consistent mapping)
    let category: string | undefined;
    if (project) {
      if (project === 'Urban Dreamscape') category = 'Film';
      else if (project === 'Harmonic Waves') category = 'Music';
      else if (project === 'Digital Renaissance') category = 'Art';
      else if (project === 'Neon Horizons') category = 'Gaming';
      else category = 'Literature';
    }
    
    // Generate description based on type
    let description: string;
    if (type === 'payment') {
      description = `Royalty payment from ${platform} for ${project}`;
    } else if (type === 'withdrawal') {
      description = `Withdrawal to bank account ending in ${Math.floor(Math.random() * 9000) + 1000}`;
    } else if (type === 'distribution') {
      description = `Distribution to collaborators for ${project}`;
    } else {
      description = `Adjustment for ${Math.random() < 0.5 ? 'reporting error' : 'contract update'}`;
    }
    
    // Generate reference number
    const reference = `REF-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    // Generate recipient (only for distributions)
    const recipient = type === 'distribution' ? `Collaborator-${Math.floor(Math.random() * 10) + 1}` : undefined;
    
    transactions.push({
      id: `transaction-${i + 1}`,
      type,
      description,
      amount,
      date: transactionDate.toISOString(),
      status,
      platform,
      project,
      recipient,
      reference,
      category
    });
  }
  
  // Sort transactions by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
