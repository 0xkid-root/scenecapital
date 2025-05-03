import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Deal status types
type DealStatus = 'active' | 'pending' | 'negotiation' | 'expired';

// Deal interface
interface Deal {
  id: string;
  name: string;
  company: string;
  logo: string;
  type: string;
  value: string;
  startDate: string;
  endDate: string;
  royaltyRate: string;
  status: DealStatus;
  terms?: string;
}

// Mock deals data
const deals: Deal[] = [
  {
    id: 'deal-001',
    name: 'Global Streaming Rights',
    company: 'StreamFlix Entertainment',
    logo: '/company-logos/streamflix.png',
    type: 'Distribution',
    value: '$450,000',
    startDate: 'Jan 15, 2025',
    endDate: 'Jan 14, 2026',
    royaltyRate: '12%',
    status: 'active',
    terms: 'Worldwide streaming rights for Urban Dreamscape with quarterly royalty payments based on viewership metrics.'
  },
  {
    id: 'deal-002',
    name: 'European Theater Distribution',
    company: 'CineTech Holdings',
    logo: '/company-logos/cinetech.png',
    type: 'Exhibition',
    value: '$275,000',
    startDate: 'Mar 1, 2025',
    endDate: 'Feb 28, 2026',
    royaltyRate: '8%',
    status: 'active',
    terms: 'Exclusive theatrical distribution rights in European markets with revenue sharing based on box office performance.'
  },
  {
    id: 'deal-003',
    name: 'Music Licensing Package',
    company: 'Harmony Records',
    logo: '/company-logos/harmony.png',
    type: 'Music',
    value: '$180,000',
    startDate: 'Feb 10, 2025',
    endDate: 'Feb 9, 2027',
    royaltyRate: '10%',
    status: 'active',
    terms: 'Licensing of Harmonic Waves soundtrack for commercial use across multiple platforms with tiered royalty structure.'
  },
  {
    id: 'deal-004',
    name: 'Merchandise Rights',
    company: 'FanGear Global',
    logo: '/company-logos/fangear.png',
    type: 'Merchandise',
    value: '$125,000',
    startDate: 'Apr 1, 2025',
    endDate: 'Mar 31, 2026',
    royaltyRate: '15%',
    status: 'pending',
    terms: 'Rights to produce and sell merchandise based on Digital Renaissance artwork with minimum guarantee and royalty percentage.'
  },
  {
    id: 'deal-005',
    name: 'Mobile Game Adaptation',
    company: 'Pixel Studios',
    logo: '/company-logos/pixel.png',
    type: 'Gaming',
    value: '$350,000',
    startDate: 'May 15, 2025',
    endDate: 'May 14, 2027',
    royaltyRate: '9%',
    status: 'negotiation',
    terms: 'Rights to develop and publish mobile games based on Neon Horizons IP with revenue sharing and milestone payments.'
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
    const status = searchParams.get('status') as DealStatus | null;
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sort') || 'startDate';
    const sortDirection = searchParams.get('order') || 'desc';
    
    // Filter deals based on query parameters
    let filteredDeals = [...deals];
    
    if (status) {
      filteredDeals = filteredDeals.filter(deal => deal.status === status);
    }
    
    if (type) {
      filteredDeals = filteredDeals.filter(deal => deal.type.toLowerCase() === type.toLowerCase());
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDeals = filteredDeals.filter(deal => 
        deal.name.toLowerCase().includes(searchLower) || 
        deal.company.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort deals
    filteredDeals.sort((a, b) => {
      let aValue: string | number = a[sortField as keyof Deal] as string;
      let bValue: string | number = b[sortField as keyof Deal] as string;
      
      // Handle special cases for sorting
      if (sortField === 'value') {
        aValue = parseFloat(a.value.replace('$', '').replace(',', ''));
        bValue = parseFloat(b.value.replace('$', '').replace(',', ''));
      } else if (sortField === 'royaltyRate') {
        aValue = parseFloat(a.royaltyRate.replace('%', ''));
        bValue = parseFloat(b.royaltyRate.replace('%', ''));
      }
      
      if (typeof aValue === 'undefined' || typeof bValue === 'undefined') {
        return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return NextResponse.json({
      success: true,
      data: filteredDeals
    });
  } catch (error) {
    console.error('Licensing deals error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch licensing deals' },
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
    const { name, company, type, value, royaltyRate, startDate, endDate, terms, status } = body;
    
    // Validate required fields
    if (!name || !company || !type || !value || !royaltyRate || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new deal
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      name,
      company,
      logo: '/company-logos/default.png', // Default logo
      type,
      value,
      startDate,
      endDate,
      royaltyRate,
      status: status || 'active',
      terms
    };
    
    // In a real implementation, you would save this to a database
    // For now, we'll just return the new deal
    
    return NextResponse.json({
      success: true,
      data: newDeal,
      message: 'Deal created successfully'
    });
  } catch (error) {
    console.error('Create deal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create licensing deal' },
      { status: 500 }
    );
  }
}
