"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAccount, useBalance, useChainId } from "wagmi";
import { createOrder } from "@/lib/api-services/orders";
import { Loader2, Info, AlertCircle, DollarSign, Percent, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types for IP assets
interface IPAsset {
  id: string;
  name: string;
  creator: string;
  category: string;
  price: string;
  available: number;
  totalSupply: number;
  description: string;
  image: string;
  apy: number;
};

// Sample IP assets data
const sampleIPAssets: IPAsset[] = [
  {
    id: "asset-001",
    name: "Urban Dreamscape",
    creator: "Alex Rivera",
    category: "Film",
    price: "5000",
    available: 75,
    totalSupply: 100,
    description: "A groundbreaking sci-fi film exploring the intersection of technology and dreams in a futuristic metropolis.",
    image: "/assets/film1.jpg",
    apy: 12.5
  },
  {
    id: "asset-002",
    name: "Harmonic Waves",
    creator: "Melody Chen",
    category: "Music",
    price: "2500",
    available: 40,
    totalSupply: 50,
    description: "An innovative music album blending classical orchestration with electronic elements and ambient soundscapes.",
    image: "/assets/music1.jpg",
    apy: 8.75
  },
  {
    id: "asset-003",
    name: "Digital Renaissance",
    creator: "Jordan Taylor",
    category: "Art",
    price: "7500",
    available: 10,
    totalSupply: 25,
    description: "A collection of digital artworks exploring the rebirth of classical themes through modern computational techniques.",
    image: "/assets/art1.jpg",
    apy: 15.2
  },
];

export function OrderManagement() {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [limitPrice, setLimitPrice] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [loading, setLoading] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState("buy");
  const [assets, setAssets] = useState<IPAsset[]>(sampleIPAssets);
  const { toast } = useToast();
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
  });

  // Get the selected asset details
  const currentAsset = assets.find(asset => asset.id === selectedAsset);
  
  // Calculate the total order amount
  useEffect(() => {
    if (currentAsset && quantity) {
      const total = parseFloat(currentAsset.price) * parseFloat(quantity);
      setAmount(total.toString());
    }
  }, [currentAsset, quantity]);

  const handleOrder = async () => {
    // Validation
    if (!selectedAsset) {
      toast({
        title: "Asset required",
        description: "Please select an IP asset to invest in",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      });
      return;
    }

    if (orderType === "limit" && (!limitPrice || isNaN(Number(limitPrice)) || Number(limitPrice) <= 0)) {
      toast({
        title: "Invalid limit price",
        description: "Please enter a valid limit price",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get the current asset
      const asset = assets.find(a => a.id === selectedAsset);
      if (!asset) {
        throw new Error("Selected asset not found");
      }

      // Prepare blockchain transaction if wallet is connected
      let transactionHash;
      if (isConnected && address) {
        // Initialize blockchain transaction
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        
        // Example contract interaction (replace with actual contract address)
        const orderManagerAddress = "YOUR_CONTRACT_ADDRESS";
        const amountInWei = ethers.utils.parseEther(amount);
        
        // Simulate blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock transaction hash
        transactionHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      }
      
      // Create order via API
      const orderData = {
        type: selectedTab as "buy" | "sell",
        orderType: orderType,
        assetId: asset.id,
        assetName: asset.name,
        assetSymbol: asset.id.substring(6), // Mock symbol
        assetCategory: asset.category,
        assetImage: asset.image,
        quantity: parseInt(quantity),
        price: parseFloat(asset.price),
        total: parseFloat(amount),
        limitPrice: orderType === "limit" ? parseFloat(limitPrice) : undefined,
        expiryDays: orderType === "limit" ? parseInt(expiryDays) : undefined,
      };
      
      // Call the API service to create the order
      const response = await createOrder(orderData);
      
      if (response.success) {
        toast({
          title: "Order placed successfully",
          description: `Your ${selectedTab} order for ${quantity} units of ${asset.name} has been placed.`,
        });
        
        // Reset form
        if (selectedTab === "buy") {
          setSelectedAsset("");
          setQuantity("1");
          setLimitPrice("");
        }
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast({
          title: "Error placing order",
          description: error.message || "An error occurred while processing your order",
          variant: "destructive",
        });
      } else {
        console.error("Unknown error", error);
        toast({
          title: "Error placing order",
          description: "An unknown error occurred while processing your order",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column - Order Form */}
      <div className="md:col-span-2">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 p-[1px]">
          <div className="bg-white dark:bg-slate-900 rounded-[inherit]">
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
              <CardDescription>
                Invest in intellectual property assets and earn royalty income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                
                <TabsContent value="buy" className="space-y-6">
                  <div className="space-y-4">
                    {/* Asset Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="asset-select" className="flex items-center gap-2">
                        IP Asset
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select an intellectual property asset to invest in</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                        <SelectTrigger id="asset-select">
                          <SelectValue placeholder="Select an IP asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              <div className="flex items-center gap-2">
                                <span>{asset.name}</span>
                                <Badge variant="outline" className="ml-2">{asset.category}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Asset Details */}
                    {currentAsset && (
                      <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 rounded-md">
                            <AvatarImage src={currentAsset.image} alt={currentAsset.name} />
                            <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                              {currentAsset.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{currentAsset.name}</h3>
                            <p className="text-sm text-muted-foreground">by {currentAsset.creator}</p>
                          </div>
                          <Badge className="ml-auto">{currentAsset.category}</Badge>
                        </div>
                        <p className="text-sm">{currentAsset.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium">${currentAsset.price}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Available</p>
                            <p className="font-medium">{currentAsset.available}/{currentAsset.totalSupply}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Est. APY</p>
                            <p className="font-medium text-green-500">{currentAsset.apy}%</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Availability</p>
                          <Progress value={(currentAsset.available / currentAsset.totalSupply) * 100} className="h-2" />
                        </div>
                      </div>
                    )}
                    
                    {/* Order Type */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-type" className="flex items-center gap-2">
                        Advanced Options
                      </Label>
                      <Switch
                        id="advanced-mode"
                        checked={advancedMode}
                        onCheckedChange={setAdvancedMode}
                      />
                    </div>
                    
                    {advancedMode && (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="order-type">Order Type</Label>
                          <Select 
                            value={orderType} 
                            onValueChange={(value) => setOrderType(value as "market" | "limit")}
                          >
                            <SelectTrigger id="order-type">
                              <SelectValue placeholder="Select order type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="market">Market Order</SelectItem>
                              <SelectItem value="limit">Limit Order</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {orderType === "limit" && (
                          <div className="space-y-2">
                            <Label htmlFor="limit-price" className="flex items-center gap-2">
                              Limit Price
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Maximum price you're willing to pay per unit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="limit-price"
                                type="number"
                                placeholder="0.00"
                                className="pl-9"
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="expiry" className="flex items-center gap-2">
                            Order Expiry
                            <span className="text-sm text-muted-foreground">{expiryDays} days</span>
                          </Label>
                          <Slider
                            id="expiry"
                            min={1}
                            max={30}
                            step={1}
                            value={[parseInt(expiryDays)]}
                            onValueChange={(value) => setExpiryDays(value[0].toString())}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="flex items-center gap-2">
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={currentAsset?.available.toString() || "100"}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    
                    {/* Total Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="flex items-center gap-2">
                        Total Amount
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-9"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          readOnly={!!currentAsset}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sell" className="space-y-4">
                  <div className="flex items-center justify-center h-40 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">You don't have any IP assets to sell yet.</p>
                      <p className="text-sm text-muted-foreground">Purchase assets first to enable selling.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {/* Order Summary */}
              {currentAsset && (
                <div className="w-full p-4 bg-muted/30 rounded-lg space-y-2">
                  <h4 className="font-medium">Order Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Asset:</p>
                    <p className="text-right">{currentAsset.name}</p>
                    
                    <p className="text-muted-foreground">Price per Unit:</p>
                    <p className="text-right">${currentAsset.price}</p>
                    
                    <p className="text-muted-foreground">Quantity:</p>
                    <p className="text-right">{quantity} units</p>
                    
                    {orderType === "limit" && (
                      <>
                        <p className="text-muted-foreground">Limit Price:</p>
                        <p className="text-right">${limitPrice}</p>
                      </>
                    )}
                    
                    <p className="text-muted-foreground">Order Type:</p>
                    <p className="text-right capitalize">{orderType} Order</p>
                    
                    <div className="col-span-2 border-t my-1"></div>
                    
                    <p className="font-medium">Total:</p>
                    <p className="text-right font-medium">${amount}</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleOrder} 
                disabled={loading || !selectedAsset || !amount || Number(amount) <= 0}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {selectedTab === "buy" ? "Buy Now" : "Sell Now"}
                  </>
                )}
              </Button>
              
              {!isConnected && (
                <p className="text-xs text-center text-muted-foreground">
                  Please connect your wallet to place orders
                </p>
              )}
            </CardFooter>
          </div>
        </Card>
      </div>
      
      {/* Right column - Market Info */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>
              Current market stats and trending assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Market Stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Market Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-semibold">$1,245,678</p>
                  <p className="text-xs text-green-500">+12.4%</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="text-lg font-semibold">1,234</p>
                  <p className="text-xs text-green-500">+5.7%</p>
                </div>
              </div>
            </div>
            
            {/* Trending Assets */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Trending Assets</h3>
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedAsset(asset.id)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage src={asset.image} alt={asset.name} />
                        <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                          {asset.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${asset.price}</p>
                      <p className="text-xs text-green-500">+{asset.apy}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}