"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  DollarSign, 
  ArrowUpRight, 
  Calendar, 
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

// Sample royalty data
const royaltyData = {
  monthly: [
    { month: "Jan", amount: 2450 },
    { month: "Feb", amount: 2780 },
    { month: "Mar", amount: 3100 },
    { month: "Apr", amount: 2890 },
    { month: "May", amount: 3250 },
    { month: "Jun", amount: 3580 }
  ],
  quarterly: [
    { quarter: "Q1", amount: 8330 },
    { quarter: "Q2", amount: 9720 }
  ],
  yearly: [
    { year: "2023", amount: 28500 },
    { year: "2024 (YTD)", amount: 18050 }
  ]
};

// Sample royalty sources
const royaltySources = [
  { name: "Cosmic Odyssey", percentage: 35, amount: 1253 },
  { name: "Echoes of Tomorrow", percentage: 25, amount: 895 },
  { name: "The Silent Protocol", percentage: 22, amount: 787 },
  { name: "Neon Shadows", percentage: 18, amount: 645 }
];

export function RoyaltyTracking() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Calculate max value for chart scaling
  const maxMonthlyAmount = Math.max(...royaltyData.monthly.map(item => item.amount));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold">Royalty Income</h2>
          </div>
          <p className="text-muted-foreground ml-8">Track your IP licensing revenue and distribution</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>

      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <Tabs defaultValue="monthly" className="w-full">
            <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent border-b">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Royalty Trends</h3>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Total Earnings:</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">$46,550</span>
              </div>
              <div className="flex items-center gap-2">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="film">Films</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="series">Web Series</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="monthly" className="p-6 space-y-4">
              {/* Chart visualization */}
              <div className="h-64 flex items-end gap-2">
                {royaltyData.monthly.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-md overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-t from-primary to-primary/60 w-full"
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.amount / maxMonthlyAmount) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{ height: `${(item.amount / maxMonthlyAmount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{item.month}</span>
                  </div>
                ))}
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Month</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">$3,580</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +10.2%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">6-Month Average</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">$3,008</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Projected Annual</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">$42,960</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quarterly" className="p-6">
              {/* Quarterly data visualization would go here */}
              <div className="text-center py-12 text-muted-foreground">
                Quarterly data visualization
              </div>
            </TabsContent>

            <TabsContent value="yearly" className="p-6">
              {/* Yearly data visualization would go here */}
              <div className="text-center py-12 text-muted-foreground">
                Yearly data visualization
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Royalty Sources</h3>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">June 2024</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {royaltySources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{source.name}</span>
                    <span className="font-bold">${source.amount}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{ width: `${source.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={source.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${source.name} royalty percentage`}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {source.percentage}% of monthly royalties
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
