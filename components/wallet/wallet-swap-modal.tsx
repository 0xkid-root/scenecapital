"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAccount, useBalance, useChainId, usePublicClient, useWalletClient } from "wagmi";
import { parseEther, parseUnits, formatUnits } from "viem";
import { ArrowDownUp, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Token } from "@/hooks/use-blockchain-data";

interface WalletSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
}

export function WalletSwapModal({ isOpen, onClose, tokens }: WalletSwapModalProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  const [fromToken, setFromToken] = useState<string>("eth");
  const [toToken, setToToken] = useState<string>("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // Get token details
  const selectedFromToken = tokens.find(t => t.id === fromToken);
  const selectedToToken = tokens.find(t => t.id === toToken);

  // Set default to token when modal opens
  useEffect(() => {
    if (isOpen && tokens.length > 1) {
      // Set default to token to first non-ETH token
      const defaultToToken = tokens.find(t => t.id !== "eth")?.id || "";
      if (defaultToToken && toToken === "") {
        setToToken(defaultToToken);
      }
    }
  }, [isOpen, tokens, toToken]);

  // Simulate exchange rate calculation
  useEffect(() => {
    if (selectedFromToken && selectedToToken) {
      try {
        // In a real implementation, you would fetch the exchange rate from a DEX API
        // For this example, we'll use a simplified calculation
        const fromTokenPrice = parseFloat(selectedFromToken.value) / parseFloat(selectedFromToken.balance || '0');
        const toTokenPrice = parseFloat(selectedToToken.value) / parseFloat(selectedToToken.balance || '0');
        
        if (fromTokenPrice > 0 && toTokenPrice > 0 && !isNaN(fromTokenPrice) && !isNaN(toTokenPrice)) {
          const rate = fromTokenPrice / toTokenPrice;
          setExchangeRate(rate);
          
          // Update to amount when from amount changes
          if (fromAmount) {
            const calculatedToAmount = (parseFloat(fromAmount) * rate).toFixed(6);
            setToAmount(calculatedToAmount);
          }
        }
      } catch (error) {
        console.error('Error calculating exchange rate:', error);
      }
    }
  }, [selectedFromToken, selectedToToken, fromAmount]);

  // Reset form when modal is opened
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFromToken("eth");
      setToToken("");
      setFromAmount("");
      setToAmount("");
      setError(null);
      onClose();
    }
  };

  // Swap token positions
  const handleSwapTokens = () => {
    const tempFromToken = fromToken;
    const tempFromAmount = fromAmount;
    
    setFromToken(toToken);
    setFromAmount(toAmount);
    setToToken(tempFromToken);
    setToAmount(tempFromAmount);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!fromToken) {
      setError("Please select a token to swap from");
      return false;
    }

    if (!toToken) {
      setError("Please select a token to swap to");
      return false;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    if (!selectedFromToken) {
      setError("Invalid from token selected");
      return false;
    }

    const tokenBalance = parseFloat(selectedFromToken.balance);
    if (parseFloat(fromAmount) > tokenBalance) {
      setError(`Insufficient balance. You have ${selectedFromToken.balance} ${selectedFromToken.symbol}`);
      return false;
    }

    if (!selectedToToken) {
      setError("Invalid to token selected");
      return false;
    }

    setError(null);
    return true;
  };

  // Handle swap transaction
  const handleSwap = async () => {
    if (!validateForm()) return;
    if (!walletClient) {
      setError("Wallet client not available");
      return;
    }
    if (!address) {
      setError("Wallet address not available");
      return;
    }
    if (!selectedFromToken) {
      setError("From token not selected");
      return;
    }
    if (!selectedToToken) {
      setError("To token not selected");
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, you would integrate with a DEX like Uniswap
      // For this example, we'll simulate a successful swap
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${selectedFromToken.symbol} for ${toAmount} ${selectedToToken.symbol}`,
        variant: "default",
      });

      onClose();
    } catch (err) {
      console.error("Swap error:", err);
      setError(err instanceof Error ? err.message : "Swap failed");
      
      toast({
        title: "Swap Failed",
        description: err instanceof Error ? err.message : "Swap failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Swap Tokens</DialogTitle>
          <DialogDescription>
            Swap between different tokens.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* From Token */}
          <div className="grid gap-2">
            <Label htmlFor="fromToken">From</Label>
            <div className="flex space-x-2">
              <Select
                value={fromToken}
                onValueChange={setFromToken}
                disabled={isLoading}
              >
                <SelectTrigger id="fromToken" className="w-[180px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem 
                      key={token.id} 
                      value={token.id}
                      disabled={token.id === toToken}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 rounded-full overflow-hidden">
                          <img 
                            src={token.logo} 
                            alt={token.symbol} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/logos/token-placeholder.svg";
                            }}
                          />
                        </div>
                        {token.symbol}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                type="number"
                placeholder="0.0"
                disabled={isLoading}
              />
            </div>
            {selectedFromToken && (
              <div className="text-xs text-muted-foreground">
                Balance: {selectedFromToken.balance} {selectedFromToken.symbol}
              </div>
            )}
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSwapTokens}
              disabled={isLoading || !toToken}
              className="h-8 w-8 rounded-full"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          
          {/* To Token */}
          <div className="grid gap-2">
            <Label htmlFor="toToken">To</Label>
            <div className="flex space-x-2">
              <Select
                value={toToken}
                onValueChange={setToToken}
                disabled={isLoading}
              >
                <SelectTrigger id="toToken" className="w-[180px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem 
                      key={token.id} 
                      value={token.id}
                      disabled={token.id === fromToken}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 rounded-full overflow-hidden">
                          <img 
                            src={token.logo} 
                            alt={token.symbol} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/logos/token-placeholder.svg";
                            }}
                          />
                        </div>
                        {token.symbol}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                type="number"
                placeholder="0.0"
                disabled={true} // Read-only, calculated based on exchange rate
              />
            </div>
            {selectedToToken && (
              <div className="text-xs text-muted-foreground">
                Balance: {selectedToToken.balance} {selectedToToken.symbol}
              </div>
            )}
          </div>
          
          {/* Exchange Rate */}
          {exchangeRate && selectedFromToken && selectedToToken && (
            <div className="text-sm text-muted-foreground text-center">
              1 {selectedFromToken.symbol} ≈ {exchangeRate.toFixed(6)} {selectedToToken.symbol}
            </div>
          )}
          
          {/* Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md flex items-start space-x-2 text-yellow-800 dark:text-yellow-300">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium">This is a simulated swap</p>
              <p>In a production environment, this would connect to a decentralized exchange like Uniswap or 1inch.</p>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSwap} disabled={isLoading || !fromToken || !toToken || !fromAmount}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              "Swap"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
