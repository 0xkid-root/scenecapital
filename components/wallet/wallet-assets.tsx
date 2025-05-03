"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccount, usePublicClient, useChainId } from "wagmi";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Wallet, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useBlockchainData, Token, NFT } from "@/hooks/use-blockchain-data";
import { Hash } from "viem";

// ERC-721 ABI for NFT metadata
const ERC721_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function WalletAssets() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { 
    tokens, 
    nfts, 
    isTokensLoading, 
    isNftsLoading 
  } = useBlockchainData();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
          <CardDescription>Connect your wallet to view your tokens and NFTs</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <Wallet className="h-16 w-16 text-muted-foreground" />
          <p className="text-center text-muted-foreground">Connect your wallet to access your digital assets</p>
          <ConnectWalletButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
        <CardDescription>View your tokens and NFTs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tokens">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tokens" className="pt-4">
            {isTokensLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : tokens.length > 0 ? (
              <div className="space-y-3">
                {tokens.map((token: Token) => (
                  <div key={token.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <img 
                          src={token.logo} 
                          alt={token.symbol} 
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/logos/token-placeholder.svg";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-xs text-muted-foreground">{token.balance} {token.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${token.value}</p>
                      <p className={`text-xs ${token.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {token.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No tokens found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nfts" className="pt-4">
            {isNftsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
              </div>
            ) : nfts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts.map((nft: NFT) => (
                  <div key={nft.id} className="rounded-lg overflow-hidden border border-border hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-muted relative">
                      <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "";
                          target.parentElement!.classList.add("flex", "items-center", "justify-center");
                          const icon = document.createElement("div");
                          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
                          target.parentElement!.appendChild(icon);
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{nft.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs font-normal">
                          {nft.collection}
                        </Badge>
                        <a 
                          href={`https://${chainId === 1 ? '' : chainId === 11155111 ? 'sepolia.' : chainId === 8453 ? 'base.' : chainId === 10 ? 'optimism.' : chainId === 42161 ? 'arbiscan.io' : ''}etherscan.io/token/${nft.contractAddress}?a=${nft.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No NFTs found in your wallet</p>
                <p className="text-xs text-muted-foreground mt-1">Connect to a wallet with NFTs to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}