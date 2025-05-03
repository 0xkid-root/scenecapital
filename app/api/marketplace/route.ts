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
    const category = searchParams.get('category');
    const type = searchParams.get('type') as 'full' | 'fractional' | null;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const status = searchParams.get('status') as 'active' | 'pending' | 'sold' | 'expired' | null;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Filter listings based on query parameters
    let filteredListings = [...marketplaceListings];
    
    if (category) {
      filteredListings = filteredListings.filter(listing => 
        listing.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (type) {
      filteredListings = filteredListings.filter(listing => listing.type === type);
    }
    
    if (minPrice !== null) {
      filteredListings = filteredListings.filter(listing => listing.price >= minPrice);
    }
    
    if (maxPrice !== null) {
      filteredListings = filteredListings.filter(listing => listing.price <= maxPrice);
    }
    
    if (status) {
      filteredListings = filteredListings.filter(listing => listing.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredListings = filteredListings.filter(listing => 
        listing.name.toLowerCase().includes(searchLower) ||
        listing.symbol.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort listings
    filteredListings.sort((a, b) => {
      const aValue = a[sortBy as keyof MarketplaceListing];
      const bValue = b[sortBy as keyof MarketplaceListing];
      
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
    
    // Paginate listings
    const totalListings = filteredListings.length;
    const totalPages = Math.ceil(totalListings / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = filteredListings.slice(startIndex, endIndex);
    
    // Calculate category distribution
    const categoryDistribution = filteredListings.reduce((acc, listing) => {
      const category = listing.category;
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          totalValue: 0
        };
      }
      acc[category].count += 1;
      acc[category].totalValue += listing.totalValue;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);
    
    // Calculate type distribution
    const typeDistribution = filteredListings.reduce((acc, listing) => {
      const type = listing.type;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalValue: 0
        };
      }
      acc[type].count += 1;
      acc[type].totalValue += listing.totalValue;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);
    
    // Calculate total market value
    const totalMarketValue = filteredListings.reduce((sum, listing) => sum + listing.totalValue, 0);

    return NextResponse.json({
      success: true,
      data: {
        listings: paginatedListings,
        pagination: {
          page,
          limit,
          totalListings,
          totalPages
        },
        metrics: {
          totalMarketValue,
          categoryDistribution: Object.entries(categoryDistribution).map(([category, data]) => ({
            category,
            count: data.count,
            totalValue: data.totalValue,
            percentage: (data.totalValue / totalMarketValue) * 100
          })),
          typeDistribution: Object.entries(typeDistribution).map(([type, data]) => ({
            type,
            count: data.count,
            totalValue: data.totalValue,
            percentage: (data.totalValue / totalMarketValue) * 100
          }))
        }
      }
    });
  } catch (error) {
    console.error('Marketplace error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch marketplace listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { assetId, type, price, quantity, description, expiresAt } = body;
    
    // Validate required fields
    if (!assetId || !type || !price || !quantity || !description || !expiresAt) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate price and quantity
    if (price <= 0 || quantity <= 0) {
      return NextResponse.json(
        { success: false, message: 'Price and quantity must be positive' },
        { status: 400 }
      );
    }
    
    // Create new listing (mock implementation)
    const newListing: MarketplaceListing = {
      id: `listing-${Date.now()}`,
      assetId,
      name: 'New Listing', // In a real implementation, this would be fetched from the asset
      symbol: 'NEWL',
      category: 'Other',
      type: type as 'full' | 'fractional',
      price,
      quantity,
      totalValue: price * quantity,
      seller: {
        id: 'user-current', // In a real implementation, this would be the current user's ID
        name: 'Current User',
        reputation: 4.5
      },
      royaltyRate: 10.0,
      description,
      performance: {
        day: 0,
        week: 0,
        month: 0
      },
      tradingVolume: 0,
      createdAt: new Date().toISOString(),
      expiresAt,
      status: 'pending',
      metadata: {}
    };
    
    // In a real implementation, this would save to a database
    
    return NextResponse.json({
      success: true,
      data: {
        listing: newListing,
        message: 'Listing created successfully and pending approval'
      }
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create marketplace listing' },
      { status: 500 }
    );
  }
}
