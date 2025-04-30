"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, Wallet, PieChart, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export function PortfolioOverview() {
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

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={item} whileHover={{ y: -5 }} className="group">
          <div className="gradient-border-card">
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                  <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">$24,563.00</h3>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full shadow-inner-glow group-hover:shadow-neon transition-all duration-300">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+12.5% from last month</span>
              </div>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -5 }} className="group">
          <div className="glass-card dark:glass-card-dark shadow-float">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Royalty Income</p>
                  <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">$4,350.00</h3>
                </div>
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 p-3 rounded-full shadow-inner-glow group-hover:shadow-neon transition-all duration-300">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+8.7% from last month</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -5 }} className="group">
          <Card className="p-6 overflow-hidden relative bg-gradient-to-br from-background to-background/80 border border-border/50 shadow-float">
            {/* Decorative background gradient */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full filter blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tokenized IPs</p>
                  <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">12</h3>
                </div>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-3 rounded-full shadow-inner-glow group-hover:shadow-neon transition-all duration-300">
                  <PieChart className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+3 new this month</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* IP Distribution */}
      <motion.div variants={item} whileHover={{ y: -5 }}>
        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">IP Portfolio Distribution</h3>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-chart-1 mr-2" />
                  <span className="text-sm">Film</span>
                </div>
                <div className="text-xl font-bold">42%</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-chart-2 mr-2" />
                  <span className="text-sm">Music</span>
                </div>
                <div className="text-xl font-bold">28%</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-chart-3 mr-2" />
                  <span className="text-sm">Books</span>
                </div>
                <div className="text-xl font-bold">18%</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-chart-4 mr-2" />
                  <span className="text-sm">Web Series</span>
                </div>
                <div className="text-xl font-bold">12%</div>
              </div>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-6">
              <div className="h-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3" style={{ width: '100%' }} />
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
