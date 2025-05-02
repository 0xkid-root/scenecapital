"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wallet, X } from "lucide-react";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath: string;
  redirectTab?: string;
}

export function WalletConnectModal({ isOpen, onClose, redirectPath, redirectTab }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Add Pharos network if not already added
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xC352",
            chainName: "Pharos Testnet",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18
            },
            rpcUrls: ["https://pharos-testnet.rpc.caldera.xyz/http"],
            blockExplorerUrls: ["https://pharos-testnet.caldera.xyz/"]
          }]
        });
      } catch (switchError: any) {
        // Handle errors or user rejection
        if (switchError.code === 4902) {
          throw new Error("Please add Pharos network to MetaMask");
        }
      }

      // Close modal and redirect
      onClose();
      const redirectUrl = redirectTab 
        ? `${redirectPath}?tab=${redirectTab}`
        : redirectPath;
      router.push(redirectUrl);

    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card dark:glass-card-dark border-none shadow-float overflow-hidden p-0">
        <div className="relative">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 opacity-70" />
          
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
          >
            <X className="h-4 w-4 text-white/70" />
          </motion.button>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo Header */}
            <div className="p-6 pb-4 flex flex-col items-center border-b border-slate-200/10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative mb-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 rounded-full blur-md" />
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    className="text-4xl font-bold flex items-center"
                    initial={{ backgroundPosition: '0% 0%' }}
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                      Scene
                    </span>
                    <span className="text-amber-500 mx-1">.</span>
                    <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                      Capital
                    </span>
                  </motion.div>
                </div>
              </motion.div>
              
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
                <p className="text-sm text-slate-400">
                  Connect your wallet to access the dashboard
                </p>
              </div>
            </div>

            {/* Connect Button Section */}
            <div className="p-6 space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center gap-2 h-12"
                >
                  {isConnecting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>Connect MetaMask</span>
                    </>
                  )}
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 