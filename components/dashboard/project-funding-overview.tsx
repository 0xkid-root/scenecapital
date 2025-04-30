"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, FileText, Users, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export function ProjectFundingOverview() {
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
                  <p className="text-sm font-medium text-muted-foreground">Project Funding</p>
                  <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">$12,345.67</h3>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full shadow-inner-glow group-hover:shadow-neon transition-all duration-300">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+8.2% from last week</span>
              </div>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -5 }} className="group">
          <div className="glass-card dark:glass-card-dark shadow-float">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Backers</p>
                  <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">156</h3>
                </div>
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 p-3 rounded-full shadow-inner-glow group-hover:shadow-neon transition-all duration-300">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+12 new backers</span>
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
                  <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                  <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">14</h3>
                </div>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-3 rounded-full shadow-inner-glow group-hover:shadow-neon transition-all duration-300">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm">
                <span className="text-amber-500">68% of funding goal reached</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Funding Progress */}
      <motion.div variants={item} whileHover={{ y: -5 }}>
        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Funding Progress</h3>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-muted-foreground">Current</div>
              <div className="text-sm font-medium">$12,345 of $18,000</div>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary" 
                style={{ width: '68%' }} 
                role="progressbar"
                aria-valuenow={68}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Funding progress"
              />
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2" />
                  <span className="text-sm">Initial Funding</span>
                </div>
                <span className="text-sm font-medium">$5,000</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-2" />
                  <span className="text-sm">Early Backers</span>
                </div>
                <span className="text-sm font-medium">$3,245</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent mr-2" />
                  <span className="text-sm">Recent Investments</span>
                </div>
                <span className="text-sm font-medium">$4,100</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
