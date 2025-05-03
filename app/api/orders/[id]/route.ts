import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Order interface
interface Order {
  id: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  asset: {
    id: string;
    name: string;
    symbol: string;
    category: string;
    image?: string;
  };
  quantity: number;
  price: number;
  total: number;
  limitPrice?: number;
  status: 'open' | 'filled' | 'partial' | 'cancelled' | 'expired';
  filledQuantity?: number;
  createdAt: string;
  expiresAt?: string;
  userId: string;
  transactionHash?: string;
}

// Sample orders data
const orders: Order[] = [
  {
    id: 'order-1',
    type: 'buy',
    orderType: 'market',
    asset: {
      id: 'asset-001',
      name: 'Urban Dreamscape',
      symbol: 'DREAM',
      category: 'Film',
      image: '/assets/film1.jpg'
    },
    quantity: 5,
    price: 5000,
    total: 25000,
    status: 'filled',
    filledQuantity: 5,
    createdAt: '2025-05-01T10:30:00Z',
    userId: '1',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: 'order-2',
    type: 'sell',
    orderType: 'limit',
    asset: {
      id: 'asset-002',
      name: 'Harmonic Waves',
      symbol: 'WAVE',
      category: 'Music',
      image: '/assets/music1.jpg'
    },
    quantity: 3,
    price: 2500,
    total: 7500,
    limitPrice: 2700,
    status: 'open',
    filledQuantity: 0,
    createdAt: '2025-05-02T14:45:00Z',
    expiresAt: '2025-05-09T14:45:00Z',
    userId: '1'
  },
  {
    id: 'order-3',
    type: 'buy',
    orderType: 'limit',
    asset: {
      id: 'asset-003',
      name: 'Digital Renaissance',
      symbol: 'RENAI',
      category: 'Art',
      image: '/assets/art1.jpg'
    },
    quantity: 2,
    price: 7500,
    total: 15000,
    limitPrice: 7200,
    status: 'partial',
    filledQuantity: 1,
    createdAt: '2025-05-03T09:15:00Z',
    expiresAt: '2025-05-10T09:15:00Z',
    userId: '1',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
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
    
    // Find the order by ID
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order details' },
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
    
    // Find the order by ID
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const { limitPrice, status } = body;
    
    // Validate the status update
    if (status && !['open', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status update. Only open and cancelled statuses can be set manually.' },
        { status: 400 }
      );
    }
    
    // Check if the order can be updated
    if (orders[orderIndex].status === 'filled' || orders[orderIndex].status === 'expired') {
      return NextResponse.json(
        { success: false, message: 'Cannot update a filled or expired order' },
        { status: 400 }
      );
    }
    
    // Update the order
    const updatedOrder: Order = {
      ...orders[orderIndex],
      limitPrice: limitPrice !== undefined ? limitPrice : orders[orderIndex].limitPrice,
      status: status || orders[orderIndex].status
    };
    
    // In a real implementation, you would update this in a database
    // For now, we'll just return the updated order
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
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
    
    // Find the order by ID
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if the order can be cancelled
    if (orders[orderIndex].status !== 'open') {
      return NextResponse.json(
        { success: false, message: 'Only open orders can be cancelled' },
        { status: 400 }
      );
    }
    
    // Update the order status to cancelled
    const cancelledOrder: Order = {
      ...orders[orderIndex],
      status: 'cancelled'
    };
    
    // In a real implementation, you would update this in a database
    // For now, we'll just return a success message
    
    return NextResponse.json({
      success: true,
      data: cancelledOrder,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
