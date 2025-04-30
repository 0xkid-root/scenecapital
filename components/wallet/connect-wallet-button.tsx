"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function ConnectWalletButton() {
  const handleConnect = () => {
    // Implement wallet connection logic here
    console.log("Connecting wallet...");
  };

  return (
    <Button onClick={handleConnect} className="flex items-center gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}