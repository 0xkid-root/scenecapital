import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { body, param, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

// Order Interface
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

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/trading', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  orderType: { type: String, enum: ['market', 'limit'], required: true },
  asset: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  limitPrice: { type: Number, min: 0 },
  status: { type: String, enum: ['open', 'filled', 'partial', 'cancelled', 'expired'], required: true },
  filledQuantity: { type: Number, min: 0 },
  createdAt: { type: String, required: true },
  expiresAt: { type: String },
  userId: { type: String, required: true },
  transactionHash: { type: String },
});

const OrderModel = mongoose.model('Order', orderSchema);

// Validation Middleware
const orderValidation = [
  body('type').isIn(['buy', 'sell']).withMessage('Invalid order type'),
  body('orderType').isIn(['market', 'limit']).withMessage('Invalid order type'),
  body('asset.id').notEmpty().withMessage('Asset ID is required'),
  body('asset.name').notEmpty().withMessage('Asset name is required'),
  body('asset.symbol').notEmpty().withMessage('Asset symbol is required'),
  body('asset.category').notEmpty().withMessage('Asset category is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('total').isFloat({ min: 0 }).withMessage('Total must be a positive number').custom((value, { req }) => {
    return value === req.body.quantity * req.body.price;
  }).withMessage('Total must equal quantity * price'),
  body('limitPrice').optional().isFloat({ min: 0 }).withMessage('Limit price must be a positive number'),
  body('status').isIn(['open', 'filled', 'partial', 'cancelled', 'expired']).withMessage('Invalid status'),
  body('filledQuantity').optional().isInt({ min: 0 }).withMessage('Filled quantity must be a non-negative integer'),
  body('createdAt').isISO8601().withMessage('Invalid createdAt date'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiresAt date'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('transactionHash').optional().isString().withMessage('Invalid transaction hash'),
];

const validate = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ success: false, errors: errors.array() }, { status: 400 });
  }
  return null;
};

// Note: The GET handler for listing all orders has been moved to /api/orders/route.ts

// GET /api/orders/:id - Retrieve a single order
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const order = await OrderModel.findOne({ id: params.id });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order details' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    body.id = `order-${uuidv4()}`; // Generate unique ID
    body.createdAt = new Date().toISOString(); // Set creation timestamp

    // Validate request body
    const validationErrors = await validateRequest(body, orderValidation);
    if (validationErrors) return validationErrors;

    // Ensure userId matches authenticated user (simplified, assuming auth_token contains userId)
    if (body.userId !== authToken.value) {
      return NextResponse.json({ success: false, message: 'Unauthorized: userId mismatch' }, { status: 403 });
    }

    // Create order
    const order = new OrderModel(body);
    await order.save();

    return NextResponse.json({ success: true, data: order, message: 'Order created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}

// PUT /api/orders/:id - Update an order
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const order = await OrderModel.findOne({ id: params.id });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check user ownership
    if (order.userId !== authToken.value) {
      return NextResponse.json({ success: false, message: 'Unauthorized: not your order' }, { status: 403 });
    }

    // Check if order can be updated
    if (order.status === 'filled' || order.status === 'expired') {
      return NextResponse.json({ success: false, message: 'Cannot update a filled or expired order' }, { status: 400 });
    }

    const body = await request.json();
    const { limitPrice, status } = body;

    // Validate status update
    if (status && !['open', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status update. Only open and cancelled statuses can be set manually.' },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { id: params.id },
      { limitPrice, status },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE /api/orders/:id - Cancel an order
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // минут
    const authToken = cookies().get('auth_token');
    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const order = await OrderModel.findOne({ id: params.id });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check user ownership
    if (order.userId !== authToken.value) {
      return NextResponse.json({ success: false, message: 'Unauthorized: not your order' }, { status: 403 });
    }

    // Check if order can be cancelled
    if (order.status !== 'open') {
      return NextResponse.json({ success: false, message: 'Only open orders can be cancelled' }, { status: 400 });
    }

    // Update order status to cancelled
    const cancelledOrder = await OrderModel.findOneAndUpdate(
      { id: params.id },
      { status: 'cancelled' },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: cancelledOrder,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ success: false, message: 'Failed to cancel order' }, { status: 500 });
  }
}

// Helper function to validate request body
async function validateRequest(body: any, validations: any[]) {
  const req = { body } as Request;
  for (const validation of validations) {
    await validation(req, {} as any, () => {});
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return NextResponse.json({ success: false, errors: errors.array() }, { status: 400 });
  }
  return null;
}