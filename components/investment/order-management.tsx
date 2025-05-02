"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

export function OrderManagement() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOrder = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here we'll implement the blockchain order placement logic
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      
      // Example contract interaction (replace with actual contract address)
      const orderManagerAddress = "YOUR_CONTRACT_ADDRESS";
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Place order logic here
      toast({
        title: "Order placed successfully",
        description: `Your order for $${amount} has been placed.`,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error", error);
      }
      toast({
        title: "Error placing order",
        description: "An unknown error occurred",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-gray-700 via-rose-500 to-orange-400 p-[1px]">
      <div className="bg-white dark:bg-slate-900 rounded-[inherit]">
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="number"
              placeholder="Investment Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleOrder} 
            disabled={loading || !amount}
            className="w-full bg-gradient-to-r from-gray-700 via-rose-500 to-orange-400"
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}