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
    
    // Find the deal by ID
    const deal = deals.find(d => d.id === id);
    
    if (!deal) {
      return NextResponse.json(
        { success: false, message: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deal
    });
  } catch (error) {
    console.error('Get deal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch licensing deal' },
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
    
    // Find the deal by ID
    const dealIndex = deals.findIndex(d => d.id === id);
    
    if (dealIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Deal not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name, company, type, value, royaltyRate, startDate, endDate, terms, status } = body;
    
    // Update the deal
    const updatedDeal: Deal = {
      ...deals[dealIndex],
      name: name || deals[dealIndex].name,
      company: company || deals[dealIndex].company,
      type: type || deals[dealIndex].type,
      value: value || deals[dealIndex].value,
      royaltyRate: royaltyRate || deals[dealIndex].royaltyRate,
      startDate: startDate || deals[dealIndex].startDate,
      endDate: endDate || deals[dealIndex].endDate,
      terms: terms !== undefined ? terms : deals[dealIndex].terms,
      status: status || deals[dealIndex].status
    };
    
    // In a real implementation, you would update this in a database
    // For now, we'll just return the updated deal
    
    return NextResponse.json({
      success: true,
      data: updatedDeal,
      message: 'Deal updated successfully'
    });
  } catch (error) {
    console.error('Update deal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update licensing deal' },
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
    
    // Find the deal by ID
    const dealIndex = deals.findIndex(d => d.id === id);
    
    if (dealIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Deal not found' },
        { status: 404 }
      );
    }
    
    // In a real implementation, you would delete this from a database
    // For now, we'll just return a success message
    
    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    console.error('Delete deal error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete licensing deal' },
      { status: 500 }
    );
  }
}
