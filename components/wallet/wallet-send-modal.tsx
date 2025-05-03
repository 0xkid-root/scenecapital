"use client";

import { useState } from "react";
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
import { parseEther, parseUnits } from "viem";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Token } from "@/hooks/use-blockchain-data";

interface WalletSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
}

export function WalletSendModal({ isOpen, onClose, tokens }: WalletSendModalProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<string>("eth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the selected token details
  const token = tokens.find(t => t.id === selectedToken);

  // Reset form when modal is opened
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setRecipient("");
      setAmount("");
      setSelectedToken("eth");
      setError(null);
      onClose();
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!recipient) {
      setError("Recipient address is required");
      return false;
    }

    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      setError("Invalid recipient address");
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    if (!token) {
      setError("Please select a token");
      return false;
    }

    const tokenBalance = parseFloat(token.balance);
    if (parseFloat(amount) > tokenBalance) {
      setError(`Insufficient balance. You have ${token.balance} ${token.symbol}`);
      return false;
    }

    setError(null);
    return true;
  };

  // Handle send transaction
  const handleSend = async () => {
    if (!validateForm()) return;
    if (!walletClient) {
      setError("Wallet client not available");
      return;
    }
    if (!address) {
      setError("Wallet address not available");
      return;
    }
    if (!publicClient) {
      setError("Public client not available");
      return;
    }
    if (!token) {
      setError("Token not selected");
      return;
    }

    setIsLoading(true);

    try {
      // For native token (ETH)
      if (token.symbol === "ETH") {
        const hash = await walletClient.sendTransaction({
          to: recipient as `0x${string}`,
          value: parseEther(amount),
        });

        // Wait for transaction to be mined
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        toast({
          title: "Transaction Successful",
          description: `Sent ${amount} ${token.symbol} to ${recipient.substring(0, 6)}...${recipient.substring(38)}`,
          variant: "default",
        });

        onClose();
      } 
      // For ERC20 tokens
      else if (token.address) {
        // ERC20 transfer function ABI
        const erc20Abi = [
          {
            name: "transfer",
            type: "function",
            inputs: [
              { name: "recipient", type: "address" },
              { name: "amount", type: "uint256" }
            ],
            outputs: [{ name: "success", type: "bool" }],
            stateMutability: "nonpayable"
          }
        ] as const;

        // Convert amount to token decimals
        const tokenAmount = parseUnits(amount, token.decimals);

        // Send transaction
        const hash = await walletClient.writeContract({
          address: token.address,
          abi: erc20Abi,
          functionName: "transfer",
          args: [recipient as `0x${string}`, tokenAmount]
        });

        // Wait for transaction to be mined
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        toast({
          title: "Transaction Successful",
          description: `Sent ${amount} ${token.symbol} to ${recipient.substring(0, 6)}...${recipient.substring(38)}`,
          variant: "default",
        });

        onClose();
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
      
      toast({
        title: "Transaction Failed",
        description: err instanceof Error ? err.message : "Transaction failed",
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
          <DialogTitle>Send Tokens</DialogTitle>
          <DialogDescription>
            Send tokens to another wallet address.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="token">Token</Label>
            <Select
              value={selectedToken}
              onValueChange={setSelectedToken}
              disabled={isLoading}
            >
              <SelectTrigger id="token">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.id} value={token.id}>
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
                      {token.symbol} ({token.balance})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                disabled={isLoading}
              />
              <div className="text-sm font-medium w-16 text-right">
                {token?.symbol || "ETH"}
              </div>
            </div>
            {token && (
              <div className="text-xs text-muted-foreground">
                Balance: {token.balance} {token.symbol}
              </div>
            )}
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
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
