"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WalletOverview } from "@/components/wallet/wallet-overview";
import { WalletAssets } from "@/components/wallet/wallet-assets";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Calendar, Download, Share2, Copy, ExternalLink, RefreshCw, Wallet, CreditCard, Coins, ArrowRight, Search, Filter, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Mock wallet data
const walletData = {
  balance: 45678.92,
  weeklyChange: 8.2,
  connectedWallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  walletType: "MetaMask",
  assets: [
    { id: 1, name: "USD Coin", symbol: "USDC", amount: 25000, value: 25000, change: 0, icon: "/assets/usdc.png" },
    { id: 2, name: "Ethereum", symbol: "ETH", amount: 5.4321, value: 15432.56, change: 2.3, icon: "/assets/eth.png" },
    { id: 3, name: "Scene Token", symbol: "SCN", amount: 1250, value: 3750, change: 15.8, icon: "/assets/scn.png" },
    { id: 4, name: "Bitcoin", symbol: "BTC", amount: 0.0325, value: 1496.36, change: -1.2, icon: "/assets/btc.png" },
  ],
  transactions: [
    { id: 1, type: "deposit", asset: "USDC", amount: 10000, value: 10000, date: "2025-04-26T14:32:00", status: "completed", hash: "0x3a4e...b721" },
    { id: 2, type: "investment", asset: "USDC", amount: 5000, value: 5000, date: "2025-04-25T09:15:00", status: "completed", project: "Ethereal Echoes: The Documentary", hash: "0x7c2d...a913" },
    { id: 3, type: "royalty", asset: "SCN", amount: 250, value: 750, date: "2025-04-22T16:45:00", status: "completed", project: "Neon Nights: Cyberpunk Novel Series", hash: "0x9e5f...c428" },
    { id: 4, type: "withdrawal", asset: "ETH", amount: 1.5, value: 4267.50, date: "2025-04-20T11:20:00", status: "completed", hash: "0x2b8a...d547" },
    { id: 5, type: "deposit", asset: "BTC", amount: 0.0325, value: 1496.36, date: "2025-04-18T08:55:00", status: "completed", hash: "0x6f1c...e892" },
    { id: 6, type: "investment", asset: "USDC", amount: 3000, value: 3000, date: "2025-04-15T13:10:00", status: "pending", project: "Quantum Realm: Interactive VR Experience", hash: "0x4d7e...b329" },
  ],
  pendingTransactions: [
    { id: 6, type: "investment", asset: "USDC", amount: 3000, value: 3000, date: "2025-04-15T13:10:00", status: "pending", project: "Quantum Realm: Interactive VR Experience", hash: "0x4d7e...b329" },
  ]
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("assets");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format crypto amount
  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${symbol}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Filter transactions based on search and type
  const filteredTransactions = walletData.transactions.filter(transaction => {
    const matchesSearch = searchQuery === "" || 
      transaction.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.project && transaction.project.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header with title and connect wallet button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
          <p className="text-muted-foreground mt-1">Manage your crypto assets and transactions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </Button>
          <ConnectWalletButton />
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-2"
        >
          <Card className="p-6 overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-50 blur-2xl rounded-full -mr-16 -mt-16" />
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <motion.h3 
                  className="text-4xl font-bold text-foreground mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {formatCurrency(walletData.balance)}
                </motion.h3>
                <motion.div 
                  className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+{walletData.weeklyChange}% from last week</span>
                </motion.div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                      <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Connected Wallet</p>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground">
                          {walletData.connectedWallet.substring(0, 6)}...{walletData.connectedWallet.substring(walletData.connectedWallet.length - 4)}
                        </p>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    {walletData.walletType}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-50 blur-2xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
              </div>
              <motion.div 
                className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                <span>Deposit</span>
              </Button>
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                <ArrowDownRight className="h-4 w-4 mr-2" />
                <span>Withdraw</span>
              </Button>
              <Button size="sm" variant="outline" className="col-span-2">
                <Coins className="h-4 w-4 mr-2" />
                <span>Swap Assets</span>
              </Button>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-50 blur-2xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Transactions</p>
                <motion.h3 
                  className="text-2xl font-bold text-foreground mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {walletData.pendingTransactions.length}
                </motion.h3>
              </div>
              <motion.div 
                className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </motion.div>
            </div>
            {walletData.pendingTransactions.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-center">
                  <div className="mr-3">
                    <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{walletData.pendingTransactions[0].project || walletData.pendingTransactions[0].type}</p>
                    <p className="text-xs text-muted-foreground">{formatCrypto(walletData.pendingTransactions[0].amount, walletData.pendingTransactions[0].asset)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Tabs for Assets and Transactions */}
      <Tabs defaultValue="assets" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Your Assets</h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-muted-foreground py-3 px-4">Asset</th>
                      <th className="text-right font-medium text-muted-foreground py-3 px-4">Amount</th>
                      <th className="text-right font-medium text-muted-foreground py-3 px-4">Value</th>
                      <th className="text-right font-medium text-muted-foreground py-3 px-4">Change</th>
                      <th className="text-right font-medium text-muted-foreground py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.assets.map((asset, index) => (
                      <motion.tr 
                        key={asset.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3">
                              {asset.icon ? (
                                <img src={asset.icon} alt={asset.name} className="h-6 w-6" />
                              ) : (
                                <Coins className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{asset.name}</p>
                              <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-medium">{formatCrypto(asset.amount, asset.symbol)}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-medium">{formatCurrency(asset.value)}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className={asset.change >= 0 ? "text-green-500" : "text-red-500"}>
                            {asset.change >= 0 ? "+" : ""}{asset.change}%
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ArrowDownRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-semibold">Transaction History</h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search transactions..." 
                      className="pl-9 w-full sm:w-[200px]" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-1 border rounded-md overflow-hidden">
                    <Button 
                      variant={transactionType === "all" ? "default" : "ghost"} 
                      size="sm" 
                      className="h-10 px-3 rounded-none"
                      onClick={() => setTransactionType("all")}
                    >
                      All
                    </Button>
                    <Button 
                      variant={transactionType === "deposit" ? "default" : "ghost"} 
                      size="sm" 
                      className="h-10 px-3 rounded-none"
                      onClick={() => setTransactionType("deposit")}
                    >
                      Deposits
                    </Button>
                    <Button 
                      variant={transactionType === "withdrawal" ? "default" : "ghost"} 
                      size="sm" 
                      className="h-10 px-3 rounded-none"
                      onClick={() => setTransactionType("withdrawal")}
                    >
                      Withdrawals
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {filteredTransactions.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Type</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Details</th>
                        <th className="text-right font-medium text-muted-foreground py-3 px-4">Amount</th>
                        <th className="text-right font-medium text-muted-foreground py-3 px-4">Date</th>
                        <th className="text-right font-medium text-muted-foreground py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction, index) => (
                        <motion.tr 
                          key={transaction.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="py-4 px-4">
                            <Badge className={getTransactionBadgeClass(transaction.type)}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              {transaction.project ? (
                                <p className="font-medium">{transaction.project}</p>
                              ) : (
                                <p className="font-medium">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</p>
                              )}
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span className="truncate max-w-[120px]">{transaction.hash}</span>
                                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <p className="font-medium">{formatCrypto(transaction.amount, transaction.asset)}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(transaction.value)}</p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <p className="whitespace-nowrap">{formatDate(transaction.date)}</p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end">
                              {transaction.status === "completed" ? (
                                <div className="flex items-center text-green-500">
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  <span>Completed</span>
                                </div>
                              ) : transaction.status === "pending" ? (
                                <div className="flex items-center text-amber-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Pending</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-500">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  <span>Failed</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-6 mb-4">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
                    <p className="text-muted-foreground max-w-md">
                      We couldn't find any transactions matching your current filters. Try adjusting your search criteria.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setTransactionType("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for styling
function getTransactionBadgeClass(type: string): string {
  switch (type) {
    case "deposit":
      return "bg-green-500 hover:bg-green-600";
    case "withdrawal":
      return "bg-amber-500 hover:bg-amber-600";
    case "investment":
      return "bg-blue-500 hover:bg-blue-600";
    case "royalty":
      return "bg-purple-500 hover:bg-purple-600";
    default:
      return "bg-slate-500 hover:bg-slate-600";
  }
}