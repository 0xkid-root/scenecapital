"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, Check, AlertCircle, UserCircle2, LogOut } from "lucide-react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { LoadingState } from "@/components/ui/loading-state";

export function ConnectWalletButton() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { session, signIn, signOut, isLoading: isAuthLoading } = useAuth();

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect({ connector: metaMask() });
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleDisconnect = () => {
    signOut(); // This will also call disconnect() internally
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "default",
    });
  };

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnect} 
        className="flex items-center gap-2"
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }
  
  // Connected but not authenticated
  if (isConnected && !session?.isAuthenticated) {
    return (
      <Button 
        onClick={handleSignIn} 
        className="flex items-center gap-2"
        disabled={isAuthLoading}
        variant="outline"
      >
        {isAuthLoading ? (
          <LoadingState size="sm" text="Authenticating..." />
        ) : (
          <>
            <UserCircle2 className="h-4 w-4 mr-2" />
            Sign In
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          {address ? formatAddress(address) : "Connected"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {session?.isAuthenticated ? "Authenticated" : "Connected"}
        </DropdownMenuLabel>
        <DropdownMenuItem className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {address ? formatAddress(address) : "Unknown"}
        </DropdownMenuItem>
        
        {session?.isAuthenticated ? (
          <DropdownMenuItem className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            Authenticated
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleSignIn} disabled={isAuthLoading} className="flex items-center gap-2">
            {isAuthLoading ? (
              <LoadingState size="sm" text="Authenticating..." />
            ) : (
              <>
                <UserCircle2 className="h-4 w-4" />
                Sign In
              </>
            )}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-500 flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}