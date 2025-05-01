"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import Image from "next/image";
import { X } from "lucide-react";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath: string;
  redirectTab?: string;
}

export function WalletConnectModal({
  isOpen,
  onClose,
  redirectPath,
  redirectTab = "investor",
}: WalletConnectModalProps) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to continue");
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts && accounts.length > 0) {
        // Successfully connected
        router.push(`${redirectPath}?tab=${redirectTab}`);
        onClose();
      }
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] bg-[#0A0B0D] border border-[#1D1E22] p-0">
        <div className="relative flex flex-col w-full">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
         </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-6">
            <h2 className="text-2xl font-semibold text-center bg-gradient-to-r from-[#7F56F0] to-[#B57BFF] bg-clip-text text-transparent">
              Connect Your Wallet
            </h2>
            <p className="text-[#6B7280] text-center mt-2 text-sm">
              Connect your wallet to access the Scene Capital platform
            </p>
          </div>

          {/* Wallet Options */}
          <div className="px-4 pb-4">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] transition-colors rounded-xl p-4 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image
                  src="/metamask-fox.svg"
                  alt="MetaMask"
                  width={28}
                  height={28}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-medium">MetaMask</p>
                <p className="text-[#9CA3AF] text-sm">Connect to your MetaMask wallet</p>
              </div>
              {isConnecting && (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin ml-2" />
              )}
            </button>

            {error && (
              <div className="mt-4 px-2">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2">
            <p className="text-xs text-[#4B5563] text-center">
              By connecting your wallet, you agree to our{" "}
              <a href="#" className="text-[#7F56F0] hover:text-[#6D46E3]">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-[#7F56F0] hover:text-[#6D46E3]">Privacy Policy</a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 