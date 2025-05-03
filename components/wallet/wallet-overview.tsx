"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAccount, useChainId } from "wagmi";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Wallet, ArrowRightLeft, Clock, ExternalLink, AlertCircle, Send, ReceiptText, RefreshCw } from "lucide-react";
import { useBlockchainData, Transaction, Token } from "@/hooks/use-blockchain-data";
import { WalletSendModal } from "./wallet-send-modal";
import { WalletReceiveModal } from "./wallet-receive-modal";
import { WalletSwapModal } from "./wallet-swap-modal";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { useAuth } from "@/lib/auth-context";
import { ClientOnly } from "@/components/client-only";

export function WalletOverview() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { session } = useAuth();
  const { 
    tokens,
    transactions, 
    isTokensLoading, 
    isTransactionsLoading,
    tokensError,
    transactionsError,
    refreshTokens: refetchTokens,
    refreshTransactions: refetchTransactions
  } = useBlockchainData();
  
  // Modal states
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  
  // Get the native token (ETH, etc.) from the tokens array
  const nativeToken = tokens.find((token: Token) => 
    token.symbol === 'ETH' || 
    token.symbol === 'MATIC' || 
    token.symbol === 'BNB'
  );

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowRightLeft className="h-4 w-4 text-red-500 rotate-45" />;
      case 'receive':
        return <ArrowRightLeft className="h-4 w-4 text-green-500 -rotate-45" />;
      case 'swap':
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Overview</CardTitle>
          <CardDescription>Connect your wallet to view your balance and transactions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <Wallet className="h-16 w-16 text-muted-foreground" />
          <p className="text-center text-muted-foreground">Connect your wallet to access your assets and transactions</p>
          <ConnectWalletButton />
        </CardContent>
      </Card>
    );
  }
  
  // Connected but not authenticated
  if (isConnected && !session?.isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in with your wallet to view your balance and transactions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <AlertCircle className="h-16 w-16 text-amber-500" />
          <p className="text-center text-muted-foreground">You need to authenticate your wallet to access this feature</p>
          <ConnectWalletButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Overview</CardTitle>
        <CardDescription>View your wallet balance and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balance">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balance" className="space-y-4 pt-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
                {tokensError && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refetchTokens}
                    className="h-6 px-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                )}
              </div>
              
              {tokensError ? (
                <ErrorFallback 
                  message="Failed to load balance"
                  variant="inline"
                  onRetry={refetchTokens}
                />
              ) : isTokensLoading ? (
                <LoadingState size="sm" text="Loading balance..." />
              ) : (
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    {nativeToken ? nativeToken.balance : '0.00'}
                  </span>
                  <span className="text-lg">{nativeToken?.symbol || 'ETH'}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Network</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>
                  {chainId === 1 ? 'Ethereum Mainnet' : 
                   chainId === 11155111 ? 'Sepolia Testnet' : 
                   chainId === 8453 ? 'Base' : 
                   chainId === 10 ? 'Optimism' : 
                   chainId === 42161 ? 'Arbitrum One' : 
                   'Unknown Network'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSendModalOpen(true)}
                className="flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                Send
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsReceiveModalOpen(true)}
                className="flex items-center gap-1"
              >
                <ReceiptText className="h-3 w-3" />
                Receive
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSwapModalOpen(true)}
                className="flex items-center gap-1"
              >
                <ArrowRightLeft className="h-3 w-3" />
                Swap
              </Button>
            </div>
            
            {/* Wallet Modals */}
            <ClientOnly>
              <WalletSendModal 
                isOpen={isSendModalOpen} 
                onClose={() => setIsSendModalOpen(false)} 
                tokens={tokens}
              />
              <WalletReceiveModal 
                isOpen={isReceiveModalOpen} 
                onClose={() => setIsReceiveModalOpen(false)} 
              />
              <WalletSwapModal 
                isOpen={isSwapModalOpen} 
                onClose={() => setIsSwapModalOpen(false)} 
                tokens={tokens}
              />
            </ClientOnly>
          </TabsContent>
          
          <TabsContent value="transactions" className="pt-4">
            {transactionsError ? (
              <ErrorFallback 
                message="Failed to load transactions"
                description="There was an error fetching your transaction history"
                onRetry={refetchTransactions}
              />
            ) : isTransactionsLoading ? (
              <div className="py-8">
                <LoadingState size="default" text="Loading transactions..." center />
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((tx: Transaction) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-full">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : 'Swapped'} {tx.amount} {tx.token}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                      </div>
                    </div>
                    <a 
                      href={`https://${chainId === 1 ? '' : chainId === 11155111 ? 'sepolia.' : chainId === 8453 ? 'base.' : chainId === 10 ? 'optimism.' : chainId === 42161 ? 'arbiscan.io' : ''}etherscan.io/tx/${tx.hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No transactions found</p>
                <p className="text-xs text-muted-foreground mt-1">Recent transactions will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}