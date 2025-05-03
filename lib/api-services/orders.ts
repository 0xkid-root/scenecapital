/**
 * Orders API Service
 * Handles all API calls related to orders in the SceneCapital platform
 */

import { toast } from "sonner";

// Order interfaces
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  category: string;
  image?: string;
}

export interface Order {
  id: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  asset: Asset;
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

export interface OrdersResponse {
  success: boolean;
  data?: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      totalOrders: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
}

export interface CreateOrderRequest {
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  assetId: string;
  assetName: string;
  assetSymbol: string;
  assetCategory: string;
  assetImage?: string;
  quantity: number;
  price: number;
  limitPrice?: number;
  expiryDays?: number;
}

/**
 * Fetches all orders with optional filters
 */
export async function getOrders(params: {
  type?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  status?: 'open' | 'filled' | 'partial' | 'cancelled' | 'expired';
  assetId?: string;
  limit?: number;
  page?: number;
}): Promise<OrdersResponse> {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/orders?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast.error('Failed to load orders. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Fetches a single order by ID
 */
export async function getOrderById(id: string): Promise<OrderResponse> {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch order');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    toast.error('Failed to load order details. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Creates a new order
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
  try {
    // Transform the request to match API expectations
    const payload: {
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
      status: string;
      createdAt: string;
      userId: string;
      expiresAt?: string;
    } = {
      type: orderData.type,
      orderType: orderData.orderType,
      asset: {
        id: orderData.assetId,
        name: orderData.assetName,
        symbol: orderData.assetSymbol,
        category: orderData.assetCategory,
        image: orderData.assetImage,
      },
      quantity: orderData.quantity,
      price: orderData.price,
      total: orderData.quantity * orderData.price,
      limitPrice: orderData.limitPrice,
      status: 'open',
      createdAt: new Date().toISOString(),
      userId: '', // Will be set by the server based on authentication
    };

    // Add expiry date for limit orders
    if (orderData.orderType === 'limit' && orderData.expiryDays) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + orderData.expiryDays);
      payload.expiresAt = expiryDate.toISOString();
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const result = await response.json();
    toast.success('Order created successfully');
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Updates an existing order
 */
export async function updateOrder(id: string, updates: Partial<Order>): Promise<OrderResponse> {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update order');
    }

    const result = await response.json();
    toast.success('Order updated successfully');
    return result;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    toast.error('Failed to update order. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Cancels an order
 */
export async function cancelOrder(id: string): Promise<OrderResponse> {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel order');
    }

    const result = await response.json();
    toast.success('Order cancelled successfully');
    return result;
  } catch (error) {
    console.error(`Error cancelling order ${id}:`, error);
    toast.error('Failed to cancel order. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
