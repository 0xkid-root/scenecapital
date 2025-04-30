'use client';

import { LicensingDeals } from "@/components/dashboard/licensing-deals";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Plus, Filter, Calendar, FileSignature } from "lucide-react";

export default function LicensingPage() {
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
            <h1 className="text-3xl font-bold">Licensing Deals</h1>
            <p className="text-muted-foreground">Manage your IP licensing agreements and partnerships</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="flex items-center gap-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Plus className="h-4 w-4 mr-1" />
              <span>New Deal</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter</span>
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={item}>
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Deals</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="negotiation">In Negotiation</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6">
              <LicensingDeals />
            </TabsContent>
            
            <TabsContent value="pending">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileSignature className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Pending Approval</h2>
                </div>
                <p className="text-muted-foreground">Licensing deals awaiting approval from counterparties or platform administrators.</p>
                
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">You have no pending licensing deals at the moment.</p>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4 mr-1" />
                      <span>Create New Deal</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="negotiation">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileSignature className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">In Negotiation</h2>
                </div>
                <p className="text-muted-foreground">Licensing deals currently being negotiated with potential licensees.</p>
                
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">You have no licensing deals in negotiation at the moment.</p>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4 mr-1" />
                      <span>Start Negotiation</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileSignature className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">License Templates</h2>
                </div>
                <p className="text-muted-foreground">Create and manage reusable license agreement templates for different types of IP.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 border-dashed flex items-center justify-center h-40 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="text-center">
                      <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium">Create New Template</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4 relative group h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg" />
                    <div className="relative z-10">
                      <h3 className="font-medium">Standard Film License</h3>
                      <p className="text-sm text-muted-foreground mt-1">Non-exclusive distribution rights for film content.</p>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm">Use Template</Button>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 relative group h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-lg" />
                    <div className="relative z-10">
                      <h3 className="font-medium">Music Streaming License</h3>
                      <p className="text-sm text-muted-foreground mt-1">Digital distribution rights for music content.</p>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm">Use Template</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
