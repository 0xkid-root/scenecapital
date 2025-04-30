"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview";
import { PortfolioChart } from "@/components/portfolio/portfolio-chart";
import { InvestmentsList } from "@/components/portfolio/investments-list";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, Share2, BarChart4, PieChart, LineChart, TrendingUp, Wallet, Building, DollarSign, Film, Music, BookOpen, Palette } from "lucide-react";

// Mock portfolio data
const portfolioData = {
  totalValue: 78432.56,
  monthlyChange: 12.7,
  yearlyChange: 32.4,
  totalInvestments: 14,
  activeInvestments: 9,
  completedInvestments: 5,
  roi: 24.8,
  categories: [
    { name: "Film", value: 32500, percentage: 41.4, change: 15.3, icon: <Film className="h-4 w-4" /> },
    { name: "Music", value: 18750, percentage: 23.9, change: 8.7, icon: <Music className="h-4 w-4" /> },
    { name: "Literature", value: 12300, percentage: 15.7, change: -2.1, icon: <BookOpen className="h-4 w-4" /> },
    { name: "Art", value: 14882.56, percentage: 19.0, change: 21.5, icon: <Palette className="h-4 w-4" /> }
  ],
  recentTransactions: [
    { id: 1, project: "Ethereal Echoes: The Documentary", amount: 5000, date: "2025-04-25", type: "investment", status: "completed" },
    { id: 2, project: "Decentralized Symphony Orchestra", amount: 2500, date: "2025-04-22", type: "investment", status: "completed" },
    { id: 3, project: "Neon Nights: Cyberpunk Novel Series", amount: 1200, date: "2025-04-18", type: "royalty", status: "received" },
    { id: 4, project: "Abstract Realities: Digital Art Collection", amount: 850, date: "2025-04-15", type: "royalty", status: "received" },
    { id: 5, project: "Quantum Realm: Interactive VR Experience", amount: 3000, date: "2025-04-10", type: "investment", status: "pending" }
  ],
  performanceData: {
    monthly: [
      { month: "Jan", value: 62500 },
      { month: "Feb", value: 64200 },
      { month: "Mar", value: 67800 },
      { month: "Apr", value: 69500 },
      { month: "May", value: 72300 },
      { month: "Jun", value: 74100 },
      { month: "Jul", value: 75800 },
      { month: "Aug", value: 76200 },
      { month: "Sep", value: 77500 },
      { month: "Oct", value: 78432 }
    ],
    quarterly: [
      { quarter: "Q1 2024", value: 58200 },
      { quarter: "Q2 2024", value: 65400 },
      { quarter: "Q3 2024", value: 72100 },
      { quarter: "Q4 2024", value: 78432 }
    ],
    yearly: [
      { year: "2021", value: 32500 },
      { year: "2022", value: 45800 },
      { year: "2023", value: 59200 },
      { year: "2024", value: 78432 }
    ]
  }
};

export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [chartType, setChartType] = useState("line");
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground mt-1">Track and manage your IP investments</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Apr 1 - Apr 30, 2025</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-50 blur-2xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
                <motion.h3 
                  className="text-3xl font-bold text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {formatCurrency(portfolioData.totalValue)}
                </motion.h3>
              </div>
              <motion.div 
                className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
            <motion.div 
              className="flex items-center pt-4 text-sm text-green-600 dark:text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+{portfolioData.monthlyChange}% this month</span>
            </motion.div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-50 blur-2xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Investments</p>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-3xl font-bold text-foreground">{portfolioData.totalInvestments}</h3>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      {portfolioData.activeInvestments} Active
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                      {portfolioData.completedInvestments} Completed
                    </Badge>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </motion.div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-50 blur-2xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Return on Investment</p>
                <motion.h3 
                  className="text-3xl font-bold text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {portfolioData.roi}%
                </motion.h3>
              </div>
              <motion.div 
                className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
            <motion.div 
              className="flex items-center pt-4 text-sm text-green-600 dark:text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+{portfolioData.yearlyChange}% this year</span>
            </motion.div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-50 blur-2xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Latest Transaction</p>
                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-foreground truncate max-w-[180px]">
                    {portfolioData.recentTransactions[0].project.split(":")[0]}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{formatCurrency(portfolioData.recentTransactions[0].amount)}</span>
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      {portfolioData.recentTransactions[0].type}
                    </Badge>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Portfolio Performance Chart and Category Breakdown */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold">Portfolio Performance</h3>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[130px] h-8">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-md overflow-hidden">
                  <Button 
                    variant={chartType === "line" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-8 px-2 rounded-none"
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={chartType === "bar" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-8 px-2 rounded-none"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart4 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <PortfolioChart />
          </div>
        </Card>
        
        <Card className="col-span-3 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Category Breakdown</h3>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {portfolioData.categories.map((category, index) => (
                <motion.div 
                  key={category.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{formatCurrency(category.value)}</span>
                      <div className="flex items-center text-xs">
                        <span className="text-muted-foreground mr-1">{category.percentage}%</span>
                        <span className={category.change >= 0 ? "text-green-500" : "text-red-500"}>
                          {category.change >= 0 ? "+" : ""}{category.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <motion.div 
                      className={`h-full rounded-full ${getCategoryColor(category.name)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions and Active Investments */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3 overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {portfolioData.recentTransactions.map((transaction, index) => (
                <motion.div 
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === "investment" ? 
                        <Wallet className="h-4 w-4 text-white" /> : 
                        <DollarSign className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{transaction.project}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                    <Badge variant="outline" className={getStatusBadgeClass(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" size="sm">
                View All Transactions
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="col-span-4 overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Active Investments</h3>
            <InvestmentsList />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper functions for styling
function getCategoryColor(category: string): string {
  switch (category) {
    case "Film":
      return "bg-gradient-to-r from-blue-500 to-indigo-600";
    case "Music":
      return "bg-gradient-to-r from-purple-500 to-pink-600";
    case "Literature":
      return "bg-gradient-to-r from-amber-500 to-orange-600";
    case "Art":
      return "bg-gradient-to-r from-emerald-500 to-green-600";
    default:
      return "bg-gradient-to-r from-slate-500 to-slate-600";
  }
}

function getTransactionColor(type: string): string {
  switch (type) {
    case "investment":
      return "bg-blue-500";
    case "royalty":
      return "bg-green-500";
    case "withdrawal":
      return "bg-amber-500";
    default:
      return "bg-slate-500";
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
    case "pending":
      return "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "received":
      return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    default:
      return "";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}
