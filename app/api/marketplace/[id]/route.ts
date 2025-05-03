import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Marketplace listing interface
interface MarketplaceListing {
  id: string;
  assetId: string;
  name: string;
  symbol: string;
  category: string;
  type: 'full' | 'fractional';
  price: number;
  quantity: number;
  totalValue: number;
  seller: {
    id: string;
    name: string;
    reputation: number;
  };
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
  expiresAt: string;
  status: 'active' | 'pending' | 'sold' | 'expired';
  metadata?: {
    [key: string]: any;
  };
}

// Mock marketplace listings data
const marketplaceListings: MarketplaceListing[] = [
  {
    id: 'listing-001',
    assetId: 'asset-001',
    name: 'Urban Dreamscape',
    symbol: 'DREAM',
    category: 'Film',
    type: 'fractional',
    price: 5000,
    quantity: 10,
    totalValue: 50000,
    seller: {
      id: 'user-001',
      name: 'Alex Rivera',
      reputation: 4.8
    },
    royaltyRate: 12.5,
    description: 'Fractional ownership in the groundbreaking sci-fi film Urban Dreamscape.',
    image: '/assets/film1.jpg',
    performance: {
      day: 2.3,
      week: 5.8,
      month: 15.2
    },
    tradingVolume: 45000,
    createdAt: '2025-01-15T00:00:00Z',
    expiresAt: '2025-07-15T00:00:00Z',
    status: 'active',
    metadata: {
      director: 'Alex Rivera',
      runtime: '120 minutes',
      releaseDate: '2025-06-01',
      genres: ['Science Fiction', 'Drama', 'Thriller']
    }
  },
  {
    id: 'listing-002',
    assetId: 'asset-002',
    name: 'Harmonic Waves',
    symbol: 'WAVE',
    category: 'Music',
    type: 'fractional',
    price: 2500,
    quantity: 5,
    totalValue: 12500,
    seller: {
      id: 'user-002',
      name: 'Melody Chen',
      reputation: 4.9
    },
    royaltyRate: 8.75,
    description: 'Fractional ownership in the innovative music album Harmonic Waves.',
    image: '/assets/music1.jpg',
    performance: {
      day: 1.2,
      week: 3.5,
      month: 9.7
    },
    tradingVolume: 28500,
    createdAt: '2025-02-10T00:00:00Z',
    expiresAt: '2025-08-10T00:00:00Z',
    status: 'active',
    metadata: {
      artist: 'Melody Chen',
      tracks: 12,
      duration: '58 minutes',
      genres: ['Electronic', 'Classical', 'Ambient']
    }
  },
  {
    id: 'listing-003',
    assetId: 'asset-003',
    name: 'Digital Renaissance',
    symbol: 'RENAI',
    category: 'Art',
    type: 'full',
    price: 7500,
    quantity: 1,
    totalValue: 7500,
    seller: {
      id: 'user-003',
      name: 'Jordan Taylor',
      reputation: 4.7
    },
    royaltyRate: 15.2,
    description: 'Full ownership of a unique digital artwork from the Digital Renaissance collection.',
    image: '/assets/art1.jpg',
    performance: {
      day: 3.1,
      week: 7.5,
      month: 18.4
    },
    tradingVolume: 37500,
    createdAt: '2025-02-20T00:00:00Z',
    expiresAt: '2025-05-20T00:00:00Z',
    status: 'active',
    metadata: {
      artist: 'Jordan Taylor',
      medium: 'Digital',
      dimensions: '3000x3000px',
      styles: ['Neo-Renaissance', 'Computational', 'Generative']
    }
  },
  {
    id: 'listing-004',
    assetId: 'asset-004',
    name: 'Neon Horizons',
    symbol: 'NEON',
    category: 'Gaming',
    type: 'fractional',
    price: 3000,
    quantity: 20,
    totalValue: 60000,
    seller: {
      id: 'user-004',
      name: 'Digital Frontiers Studio',
      reputation: 4.6
    },
    royaltyRate: 10.5,
    description: 'Fractional ownership in the cyberpunk open-world game Neon Horizons.',
    image: '/assets/gaming1.jpg',
    performance: {
      day: 1.8,
      week: 4.2,
      month: 12.3
    },
    tradingVolume: 33000,
    createdAt: '2025-03-10T00:00:00Z',
    expiresAt: '2025-09-10T00:00:00Z',
    status: 'active',
    metadata: {
      developer: 'Digital Frontiers Studio',
      platform: 'Multi-platform',
      genre: 'Open-world RPG',
      releaseDate: '2025-09-15'
    }
  },
  {
    id: 'listing-005',
    assetId: 'asset-005',
    name: 'Ethereal Chronicles',
    symbol: 'ETHER',
    category: 'Literature',
    type: 'fractional',
    price: 1500,
    quantity: 15,
    totalValue: 22500,
    seller: {
      id: 'user-005',
      name: 'Aria Montgomery',
      reputation: 4.5
    },
    royaltyRate: 7.5,
    description: 'Fractional ownership in the fantasy novel series Ethereal Chronicles.',
    image: '/assets/literature1.jpg',
    performance: {
      day: 0.9,
      week: 2.8,
      month: 6.5
    },
    tradingVolume: 18000,
    createdAt: '2025-03-25T00:00:00Z',
    expiresAt: '2025-09-25T00:00:00Z',
    status: 'active',
    metadata: {
      author: 'Aria Montgomery',
      format: 'Novel Series',
      volumes: 5,
      genres: ['Fantasy', 'Science Fiction', 'Adventure']
    }
  }
];

// Transaction interface
interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  transactionHash?: string;
}

// Mock transactions data
const transactions: Transaction[] = [
  {
    id: 'tx-001',
    listingId: 'listing-001',
    buyerId: 'user-005',
    sellerId: 'user-001',
    price: 5000,
    quantity: 2,
    totalAmount: 10000,
    status: 'completed',
    timestamp: '2025-02-15T10:30:00Z',
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: 'tx-002',
    listingId: 'listing-002',
    buyerId: 'user-004',
    sellerId: 'user-002',
    price: 2500,
    quantity: 1,
    totalAmount: 2500,
    status: 'completed',
    timestamp: '2025-03-05T14:45:00Z',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12'
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
    
    // Find the listing by ID
    const listing = marketplaceListings.find(l => l.id === id);
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }

    // Get transaction history for this listing
    const listingTransactions = transactions.filter(t => t.listingId === id);
    
    // Get similar listings (same category)
    const similarListings = marketplaceListings
      .filter(l => l.category === listing.category && l.id !== listing.id && l.status === 'active')
      .map(l => ({
        id: l.id,
        name: l.name,
        symbol: l.symbol,
        type: l.type,
        price: l.price,
        image: l.image
      }));
    
    // Get price history (mock data)
    const priceHistory = generatePriceHistory(listing);

    return NextResponse.json({
      success: true,
      data: {
        listing,
        transactions: listingTransactions,
        similarListings,
        priceHistory
      }
    });
  } catch (error) {
    console.error('Get listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch listing details' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    
    // Find the listing by ID
    const listingIndex = marketplaceListings.findIndex(l => l.id === id);
    
    if (listingIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }
    
    // Get the existing listing
    const listing = marketplaceListings[listingIndex];
    
    // Check if the user is the seller (mock check)
    // In a real implementation, you would compare the authenticated user's ID with the seller's ID
    const isUserSeller = true;
    
    if (!isUserSeller) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to update this listing' },
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { price, quantity, description, expiresAt, status } = body;
    
    // Validate required fields
    if (!price && !quantity && !description && !expiresAt && !status) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }
    
    // Update the listing
    const updatedListing = {
      ...listing,
      price: price || listing.price,
      quantity: quantity || listing.quantity,
      totalValue: (price || listing.price) * (quantity || listing.quantity),
      description: description || listing.description,
      expiresAt: expiresAt || listing.expiresAt,
      status: status || listing.status
    };
    
    // In a real implementation, this would update the database
    // For this mock, we'll just return the updated listing
    
    return NextResponse.json({
      success: true,
      data: {
        listing: updatedListing,
        message: 'Listing updated successfully'
      }
    });
  } catch (error) {
    console.error('Update listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    
    // Find the listing by ID
    const listingIndex = marketplaceListings.findIndex(l => l.id === id);
    
    if (listingIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the seller (mock check)
    // In a real implementation, you would compare the authenticated user's ID with the seller's ID
    const isUserSeller = true;
    
    if (!isUserSeller) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to delete this listing' },
        { status: 403 }
      );
    }
    
    // In a real implementation, this would delete from the database
    // For this mock, we'll just return success
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Listing deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete listing' },
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
    
    // Find the listing by ID
    const listing = marketplaceListings.find(l => l.id === id);
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }
    
    // Check if the listing is active
    if (listing.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'This listing is not available for purchase' },
        { status: 400 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { action, quantity } = body;
    
    // Validate action
    if (action !== 'purchase') {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }
    
    // Validate quantity
    if (!quantity || quantity <= 0 || quantity > listing.quantity) {
      return NextResponse.json(
        { success: false, message: 'Invalid quantity' },
        { status: 400 }
      );
    }
    
    // Calculate total amount
    const totalAmount = listing.price * quantity;
    
    // Create a new transaction (mock implementation)
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      listingId: listing.id,
      buyerId: 'user-current', // In a real implementation, this would be the current user's ID
      sellerId: listing.seller.id,
      price: listing.price,
      quantity,
      totalAmount,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, this would save to a database and process the transaction
    
    return NextResponse.json({
      success: true,
      data: {
        transaction,
        message: 'Purchase initiated successfully',
        nextSteps: [
          'Your purchase is being processed.',
          'You will receive a confirmation once the transaction is complete.',
          'You can view the status of your purchase in your orders.'
        ]
      }
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}

// Helper function to generate price history
function generatePriceHistory(listing: MarketplaceListing) {
  const now = new Date();
  const startDate = new Date(listing.createdAt);
  const dayDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const priceData = [];
  let currentPrice = listing.price * 0.9; // Start at 90% of current price
  
  for (let i = 0; i <= dayDiff; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Add some randomness but maintain an upward trend
    const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
    const trendFactor = 1 + (i / Math.max(1, dayDiff)) * 0.1; // Gradually increase
    
    currentPrice = currentPrice * randomFactor * trendFactor;
    
    // Ensure we reach the current price at the end
    if (i === dayDiff) {
      currentPrice = listing.price;
    }
    
    priceData.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  return priceData;
}
