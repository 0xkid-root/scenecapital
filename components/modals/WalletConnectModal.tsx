"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wallet, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useConnect, useAccount } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useAuth } from "@/lib/auth-context";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorFallback } from "@/components/ui/error-fallback";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath: string;
  redirectTab?: string;
  requireAuth?: boolean;
}

export function WalletConnectModal({ isOpen, onClose, redirectPath, redirectTab, requireAuth = true }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'connect' | 'authenticate' | 'success'>('connect');
  const router = useRouter();
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { session, signIn, isLoading: isAuthLoading, error: authError } = useAuth();

  // Check if already connected and authenticated on mount
  useEffect(() => {
    if (isOpen) {
      if (isConnected) {
        if (session?.isAuthenticated || !requireAuth) {
          handleSuccess();
        } else {
          setStep('authenticate');
        }
      } else {
        setStep('connect');
      }
    }
  }, [isOpen, isConnected, session?.isAuthenticated]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await connect({ connector: metaMask() });
      
      if (requireAuth) {
        setStep('authenticate');
      } else {
        handleSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleAuthenticate = async () => {
    try {
      await signIn();
      setStep('success');
      setTimeout(() => {
        handleSuccess();
      }, 1500); // Show success state briefly before redirecting
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    }
  };
  
  const handleSuccess = () => {
    // Close modal and redirect
    onClose();
    const redirectUrl = redirectTab 
      ? `${redirectPath}?tab=${redirectTab}`
      : redirectPath;
    router.push(redirectUrl);
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

            {/* Content Section */}
            <div className="p-6 space-y-4">
              {step === 'connect' && (
                <>
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
                        <LoadingState size="sm" text="Connecting..." />
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          <span>Connect MetaMask</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </>
              )}
              
              {step === 'authenticate' && (
                <>
                  <div className="text-center mb-4">
                    <p className="text-sm text-slate-400 mb-2">
                      Please sign a message to authenticate your wallet
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAuthenticate}
                      disabled={isAuthLoading}
                      className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center gap-2 h-12"
                    >
                      {isAuthLoading ? (
                        <LoadingState size="sm" text="Authenticating..." />
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          <span>Sign Message</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </>
              )}
              
              {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                  <h3 className="text-lg font-medium text-white mb-1">Authentication Successful</h3>
                  <p className="text-sm text-slate-400">Redirecting you to the dashboard...</p>
                </div>
              )}

              {error && (
                <ErrorFallback
                  message="Connection Error"
                  description={error}
                  variant="compact"
                  onRetry={() => {
                    setError(null);
                    if (step === 'connect') {
                      connectWallet();
                    } else if (step === 'authenticate') {
                      handleAuthenticate();
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 