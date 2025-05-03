"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /**
   * The size of the loading spinner
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  
  /**
   * Optional text to display alongside the spinner
   */
  text?: string;
  
  /**
   * Whether to center the loading state
   * @default false
   */
  center?: boolean;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to show a full-page loading overlay
   * @default false
   */
  fullPage?: boolean;
}

/**
 * A reusable loading state component with various size and layout options
 */
export function LoadingState({
  size = "default",
  text,
  center = false,
  className,
  fullPage = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };
  
  const spinnerSize = sizeClasses[size];
  
  const content = (
    <div 
      className={cn(
        "flex items-center gap-3",
        center && "justify-center",
        className
      )}
    >
      <Loader2 className={cn(spinnerSize, "animate-spin text-primary")} />
      {text && (
        <p className={cn(
          "text-muted-foreground font-medium",
          size === "sm" && "text-sm",
          size === "lg" && "text-lg"
        )}>
          {text}
        </p>
      )}
    </div>
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }
  
  return content;
}
