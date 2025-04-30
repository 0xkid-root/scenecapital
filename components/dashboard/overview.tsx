"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Wallet, PieChart, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export function Overview() {
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
                  <p className="text-sm font-medium text-muted-foreground">IP Portfolio Value</p>
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
                  <DollarSign className="h-5 w-5 text-secondary" />
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
                  <p className="text-sm font-medium text-muted-foreground">Licensing Deals</p>
                  <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">24</h3>
                </div>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-3 rounded-full shadow-inner-glow group-hover:shadow-neon transition-all duration-300">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+5 new deals this month</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item} whileHover={{ y: -5 }}>
          <Card className="overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">IP Portfolio Distribution</h3>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-chart-1 mr-2" />
                    <span className="text-sm">Real Estate</span>
                  </div>
                  <div className="text-xl font-bold">42%</div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5" />
                    <span>Film</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary mr-1.5" />
                    <span>Music</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-accent mr-1.5" />
                    <span>Books</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-chart-4 mr-2" />
                    <span className="text-sm">Bonds</span>
                  </div>
                  <div className="text-xl font-bold">18%</div>
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="flex h-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "42%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-chart-1 h-full"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "28%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="bg-chart-2 h-full"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "18%" }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="bg-chart-3 h-full"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "12%" }}
                    transition={{ duration: 1, delay: 1.1 }}
                    className="bg-chart-4 h-full"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -5 }}>
          <Card className="overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-secondary/5 to-transparent border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Royalty Metrics</h3>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="p-6 pt-8">
              <div className="flex items-end justify-between h-40">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                  const heights = ["60%", "40%", "75%", "55%", "70%", "85%"];
                  const delays = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
                  return (
                    <div key={month} className="flex flex-col items-center">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: heights[i] }}
                        transition={{ duration: 1, delay: delays[i] }}
                        className="w-8 bg-gradient-to-t from-primary/80 to-primary/20 rounded-t-md"
                      />
                      <span className="text-xs mt-2 text-muted-foreground">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}