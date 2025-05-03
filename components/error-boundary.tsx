"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the child component tree.
 * Displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="w-full max-w-md mx-auto my-8 border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-950 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <CardTitle className="text-red-600 dark:text-red-400">Something went wrong</CardTitle>
            </div>
            <CardDescription className="text-red-600/80 dark:text-red-400/80">
              An error occurred while rendering this component
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Error:</p>
              <p className="mb-4 font-mono text-xs bg-muted p-2 rounded overflow-auto max-h-[100px]">
                {this.state.error?.message || "Unknown error"}
              </p>
              
              {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                <>
                  <p className="font-medium mb-1">Component Stack:</p>
                  <p className="font-mono text-xs bg-muted p-2 rounded overflow-auto max-h-[200px]">
                    {this.state.errorInfo.componentStack}
                  </p>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button onClick={this.resetError}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}
