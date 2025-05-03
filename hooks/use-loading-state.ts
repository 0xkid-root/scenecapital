"use client";

import { useState, useCallback } from "react";

interface UseLoadingStateReturn<T> {
  /**
   * The current loading state
   */
  isLoading: boolean;
  
  /**
   * Any error that occurred during the operation
   */
  error: Error | null;
  
  /**
   * The result of the operation
   */
  data: T | null;
  
  /**
   * A wrapper function that handles loading state, errors, and result
   */
  execute: <R extends T>(
    asyncFn: () => Promise<R>,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: Error) => void;
      resetOnStart?: boolean;
    }
  ) => Promise<R | null>;
  
  /**
   * Reset the loading state, error, and data
   */
  reset: () => void;
}

/**
 * A custom hook for managing loading states, errors, and results of async operations
 * Particularly useful for blockchain interactions
 */
export function useLoadingState<T = any>(initialData: T | null = null): UseLoadingStateReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(initialData);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(initialData);
  }, [initialData]);

  const execute = useCallback(async <R extends T>(
    asyncFn: () => Promise<R>,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: Error) => void;
      resetOnStart?: boolean;
    }
  ): Promise<R | null> => {
    try {
      if (options?.resetOnStart) {
        setData(initialData);
        setError(null);
      }
      
      setIsLoading(true);
      const result = await asyncFn();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [initialData]);

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
  };
}
