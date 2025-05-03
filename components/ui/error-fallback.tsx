"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
  /**
   * The error message to display
   */
  message?: string;
  
  /**
   * A more detailed description of the error
   */
  description?: string;
  
  /**
   * Function to retry the failed operation
   */
  onRetry?: () => void;
  
  /**
   * Whether the retry operation is currently in progress
   * @default false
   */
  isRetrying?: boolean;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
  
  /**
   * The type of error
   * @default "default"
   */
  variant?: "default" | "compact" | "inline";
}

/**
 * A reusable error fallback component for API and blockchain interaction failures
 */
export function ErrorFallback({
  message = "Something went wrong",
  description = "There was an error loading this content. Please try again.",
  onRetry,
  isRetrying = false,
  className,
  variant = "default"
}: ErrorFallbackProps) {
  if (variant === "compact") {
    return (
      <div className={cn(
        "rounded-md bg-red-50 dark:bg-red-950/50 p-3 flex items-start space-x-2",
        className
      )}>
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">{message}</p>
          {description && (
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{description}</p>
          )}
          {onRetry && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRetry} 
              disabled={isRetrying}
              className="mt-2 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 h-8 px-2 py-0"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Retry
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  if (variant === "inline") {
    return (
      <div className={cn(
        "flex items-center gap-2 text-red-600 dark:text-red-400",
        className
      )}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRetry} 
            disabled={isRetrying}
            className="h-7 px-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={cn(
      "rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 p-4",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base font-medium text-red-800 dark:text-red-300">{message}</h3>
      </div>
      {description && (
        <p className="mt-2 ml-11 text-sm text-red-700 dark:text-red-400">{description}</p>
      )}
      {onRetry && (
        <div className="mt-4 ml-11">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            disabled={isRetrying}
            className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
