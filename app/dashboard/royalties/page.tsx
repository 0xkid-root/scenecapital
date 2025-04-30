'use client';

import { RoyaltyTracking } from "@/components/dashboard/royalty-tracking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Download, Filter, Calendar, ArrowUpDown } from "lucide-react";

export default function RoyaltiesPage() {
  // Animation variants
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
    <div className="container mx-auto p-6 relative">
      {/* Background gradient elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative z-10 space-y-6"
      >
        {/* Page Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Royalty Income</h1>
            <p className="text-muted-foreground">Track and manage your IP licensing revenue</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last 30 Days</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4 mr-1" />
              <span>Export</span>
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={item}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">By Project</TabsTrigger>
              <TabsTrigger value="platforms">By Platform</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <RoyaltyTracking />
            </TabsContent>
            
            <TabsContent value="projects">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Royalties by Project</h2>
                <p className="text-muted-foreground">Detailed breakdown of royalty income by individual project.</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="platforms">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Royalties by Platform</h2>
                <p className="text-muted-foreground">Analyze your royalty income across different distribution platforms.</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Royalty Reports</h2>
                <p className="text-muted-foreground">Generate and download detailed royalty reports for accounting and tax purposes.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
