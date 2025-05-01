"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";
import { ProjectFundingOverview } from "@/components/dashboard/project-funding-overview";
import { TokenizedIPCards } from "@/components/dashboard/tokenized-ip-cards";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileSignature, DollarSign, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { NetworkSwitch } from "@/components/NetworkSwitch";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("investor");
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Get current accounts
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          } else {
            router.push("/");
          }
        } catch (err) {
          console.error("Failed to get accounts:", err);
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          router.push("/");
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      });
    }

    // Set active tab from URL params
    const tab = searchParams.get("tab");
    if (tab && (tab === "investor" || tab === "creator")) {
      setActiveTab(tab);
    }

    // Cleanup listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [searchParams, router]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard?tab=${value}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="flex-1 space-y-6 p-4 md:p-8 pt-6 relative overflow-hidden"
    >
      {/* Background gradient elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow" />
      
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">IP Dashboard</h2>
          <p className="text-muted-foreground mt-1">Welcome to your decentralized IP licensing platform</p>
        </div>
        <motion.div 
          className="glass-card dark:glass-card-dark px-4 py-2 rounded-lg shadow-float flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <div>
            <p className="text-sm font-medium">
              IP Portfolio Value: <span className="font-bold text-primary">$24,563.00</span>
            </p>
          </div>
          <NetworkSwitch />
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-navy-800">
            <TabsTrigger value="investor">Investor Dashboard</TabsTrigger>
            <TabsTrigger value="creator">Creator Dashboard</TabsTrigger>
          </TabsList>
          
          {/* Creator Dashboard */}
          <TabsContent value="creator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 col-span-1 md:col-span-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Creator Dashboard</h3>
                    <p className="text-muted-foreground">Manage your creative IP assets and monitor your revenue</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                      <FileSignature className="h-4 w-4 mr-2" />
                      Submit New Project
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <ProjectFundingOverview />
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Recent Licensing Activity</h3>
                </div>
                <div className="p-6">
                  <RecentActivity />
                </div>
              </Card>
              <Card className="col-span-1">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <FileSignature className="h-6 w-6" />
                      <span>Create License</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      <span>View Royalties</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <Wallet className="h-6 w-6" />
                      <span>Withdraw Funds</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <FileSignature className="h-6 w-6" />
                      <span>IP Protection</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Investor Dashboard */}
          <TabsContent value="investor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 col-span-1 md:col-span-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Investor Dashboard</h3>
                    <p className="text-muted-foreground">Track your IP investments and discover new opportunities</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                      <Wallet className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <PortfolioOverview />
            
            <TokenizedIPCards />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-1/3 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-gradient-to-r from-secondary to-accent opacity-20 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-2/3 left-1/4 w-10 h-10 rounded-full bg-gradient-to-r from-accent to-primary opacity-20 animate-float" style={{ animationDelay: '2s' }} />
    </motion.div>
  );
}