/**
 * Input sanitization utilities for SceneCapital
 */

import logger from './logger';

/**
 * Sanitize a string input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;
  
  try {
    // Replace potentially dangerous characters
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  } catch (error) {
    logger.error('Error sanitizing input', { error });
    return '';
  }
}

/**
 * Sanitize an object by sanitizing all string properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj } as T;
  
  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizeInput(result[key]) as any;
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = sanitizeObject(result[key]) as any;
    }
  }
  
  return result;
}

/**
 * Validate and sanitize a MongoDB query to prevent NoSQL injection
 */
export function sanitizeMongoQuery(query: Record<string, any>): Record<string, any> {
  if (!query || typeof query !== 'object') return {};
  
  const result = { ...query };
  
  // Remove any keys that start with $ to prevent operator injection
  for (const key in result) {
    if (key.startsWith('$')) {
      delete result[key];
      logger.warn('Removed potentially dangerous MongoDB operator', { key });
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = sanitizeMongoQuery(result[key]);
    } else if (typeof result[key] === 'string') {
      result[key] = sanitizeInput(result[key]);
    }
  }
  
  return result;
}
