/**
 * Authentication utilities for SceneCapital
 */

import { cookies } from 'next/headers';
import logger from './logger';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Verify JWT token and return decoded payload
 * Note: This is a mock implementation for development purposes
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    // In a real implementation, this would verify the JWT signature
    // For development, we'll just return a mock payload
    if (token === 'mock_jwt_token') {
      return {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000)
      };
    }
    
    logger.warn('Invalid token provided');
    return null;
  } catch (error) {
    logger.error('Token verification error', { error });
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const authToken = cookies().get('auth_token');
  return !!authToken;
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<{ id: string; email: string; role: string } | null> {
  const authToken = cookies().get('auth_token')?.value;
  
  if (!authToken) {
    return null;
  }
  
  const payload = await verifyToken(authToken);
  
  if (!payload) {
    return null;
  }
  
  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role
  };
}

/**
 * Generate a new token
 * Note: This is a mock implementation for development purposes
 */
export function generateToken(userId: string, email: string, role: string = 'user'): string {
  // In a real implementation, this would generate a signed JWT
  // For development, we'll just return a mock token
  return 'mock_jwt_token';
}
