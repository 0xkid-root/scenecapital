"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { Copy, Check, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface WalletReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletReceiveModal({ isOpen, onClose }: WalletReceiveModalProps) {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  // Format address for display
  const formattedAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : '';

  // Reset state when modal is opened
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCopied(false);
      onClose();
    }
  };

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
        variant: "default",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Receive Tokens</DialogTitle>
          <DialogDescription>
            Share your wallet address to receive tokens.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          {/* QR Code */}
          <div className="w-48 h-48 bg-white p-2 rounded-lg">
            {address ? (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${address}`} 
                alt="Wallet Address QR Code"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Address */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Your Wallet Address</p>
            <div className="flex items-center justify-center space-x-2">
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm">
                {address ? address : 'No wallet connected'}
              </code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyToClipboard} 
                disabled={!address}
                className="h-8 w-8"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
