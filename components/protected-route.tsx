"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoadingState } from "@/components/ui/loading-state";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Redirect path if user is not authenticated
   * @default "/dashboard"
   */
  redirectTo?: string;
}

/**
 * A wrapper component that protects routes by requiring authentication
 * Redirects to the specified path if the user is not authenticated
 */
export function ProtectedRoute({ 
  children, 
  redirectTo = "/dashboard" 
}: ProtectedRouteProps) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [session, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingState size="lg" text="Checking authentication..." center />
      </div>
    );
  }

  if (!session?.isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
}
