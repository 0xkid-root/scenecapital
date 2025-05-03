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
    const type = searchParams.get('type') as 'buy' | 'sell' | null;
    const orderType = searchParams.get('orderType') as 'market' | 'limit' | null;
    const status = searchParams.get('status') as Order['status'] | null;
    const assetId = searchParams.get('assetId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Generate mock orders
    const orders = generateMockOrders();
    
    // Filter orders based on query parameters
    let filteredOrders = [...orders];
    
    if (type) {
      filteredOrders = filteredOrders.filter(order => order.type === type);
    }
    
    if (orderType) {
      filteredOrders = filteredOrders.filter(order => order.orderType === orderType);
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (assetId) {
      filteredOrders = filteredOrders.filter(order => order.asset.id === assetId);
    }
    
    // Sort orders by createdAt (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Paginate results
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        orders: paginatedOrders,
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
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
    const { type, orderType, assetId, assetName, assetSymbol, assetCategory, quantity, price, limitPrice, expiryDays } = body;
    
    // Validate required fields
    if (!type || !orderType || !assetId || !assetName || !quantity || !price) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate order type
    if (type !== 'buy' && type !== 'sell') {
      return NextResponse.json(
        { success: false, message: 'Invalid order type' },
        { status: 400 }
      );
    }
    
    // Validate order type
    if (orderType !== 'market' && orderType !== 'limit') {
      return NextResponse.json(
        { success: false, message: 'Invalid order type' },
        { status: 400 }
      );
    }
    
    // Validate limit price for limit orders
    if (orderType === 'limit' && !limitPrice) {
      return NextResponse.json(
        { success: false, message: 'Limit price is required for limit orders' },
        { status: 400 }
      );
    }
    
    // Calculate total
    const total = quantity * price;
    
    // Calculate expiry date for limit orders
    let expiresAt: string | undefined;
    if (orderType === 'limit' && expiryDays) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + parseInt(expiryDays));
      expiresAt = expiry.toISOString();
    }
    
    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      type,
      orderType,
      asset: {
        id: assetId,
        name: assetName,
        symbol: assetSymbol,
        category: assetCategory || 'Other',
        image: body.assetImage
      },
      quantity,
      price,
      total,
      limitPrice: orderType === 'limit' ? limitPrice : undefined,
      status: orderType === 'market' ? 'filled' : 'open',
      filledQuantity: orderType === 'market' ? quantity : 0,
      createdAt: new Date().toISOString(),
      expiresAt,
      userId: '1', // Mock user ID
      transactionHash: orderType === 'market' ? `0x${Math.random().toString(16).substring(2, 42)}` : undefined
    };
    
    // In a real implementation, you would save this to a database
    // For now, we'll just return the new order
    
    return NextResponse.json({
      success: true,
      data: newOrder,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} order placed successfully`
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to place order' },
      { status: 500 }
    );
  }
}

// Helper function to generate mock orders
function generateMockOrders(): Order[] {
  const now = new Date();
  const orders: Order[] = [];
  
  // Sample assets
  const assets = [
    { id: 'asset-001', name: 'Urban Dreamscape', symbol: 'DREAM', category: 'Film', image: '/assets/film1.jpg' },
    { id: 'asset-002', name: 'Harmonic Waves', symbol: 'WAVE', category: 'Music', image: '/assets/music1.jpg' },
    { id: 'asset-003', name: 'Digital Renaissance', symbol: 'RENAI', category: 'Art', image: '/assets/art1.jpg' },
    { id: 'asset-004', name: 'Neon Horizons', symbol: 'NEON', category: 'Gaming', image: '/assets/gaming1.jpg' },
    { id: 'asset-005', name: 'Ethereal Chronicles', symbol: 'ETHER', category: 'Literature', image: '/assets/literature1.jpg' }
  ];
  
  // Sample order types and statuses
  const types = ['buy', 'sell'] as const;
  const orderTypes = ['market', 'limit'] as const;
  const statuses = ['open', 'filled', 'partial', 'cancelled', 'expired'] as const;
  
  // Generate 30 random orders
  for (let i = 0; i < 30; i++) {
    // Random asset
    const asset = assets[Math.floor(Math.random() * assets.length)];
    
    // Random type and order type
    const type = types[Math.floor(Math.random() * types.length)];
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    
    // Random status based on order type
    let status: Order['status'];
    if (orderType === 'market') {
      status = 'filled'; // Market orders are always filled
    } else {
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    // Random quantity and price
    const quantity = Math.floor(Math.random() * 10) + 1;
    const price = parseFloat((1000 + Math.random() * 9000).toFixed(2));
    const total = quantity * price;
    
    // Random dates
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - daysAgo);
    
    // Expiry date for limit orders
    let expiresAt: string | undefined;
    if (orderType === 'limit') {
      const expiry = new Date(createdAt);
      expiry.setDate(createdAt.getDate() + 7); // 7-day expiry
      expiresAt = expiry.toISOString();
    }
    
    // Filled quantity based on status
    let filledQuantity: number | undefined;
    if (status === 'filled') {
      filledQuantity = quantity;
    } else if (status === 'partial') {
      filledQuantity = Math.floor(quantity * (Math.random() * 0.8 + 0.1)); // 10-90% filled
    } else if (status === 'open' || status === 'cancelled' || status === 'expired') {
      filledQuantity = 0;
    }
    
    // Transaction hash for filled or partial orders
    let transactionHash: string | undefined;
    if (status === 'filled' || status === 'partial') {
      transactionHash = `0x${Math.random().toString(16).substring(2, 42)}`;
    }
    
    orders.push({
      id: `order-${i + 1}`,
      type,
      orderType,
      asset,
      quantity,
      price,
      total,
      limitPrice: orderType === 'limit' ? parseFloat((price * (type === 'buy' ? 0.95 : 1.05)).toFixed(2)) : undefined,
      status,
      filledQuantity,
      createdAt: createdAt.toISOString(),
      expiresAt,
      userId: '1', // Mock user ID
      transactionHash
    });
  }
  
  return orders;
}
