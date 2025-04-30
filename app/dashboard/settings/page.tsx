"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { 
  User, 
  Shield, 
  Bell, 
  Wallet, 
  Globe, 
  Brush, 
  Layers, 
  HelpCircle,
  ExternalLink,
  Save,
  Undo,
  ChevronRight
} from "lucide-react";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [hasChanges, setHasChanges] = useState(false);
  
  // Simulated account data
  const accountData = {
    accountType: "Creator & Investor",
    memberSince: "April 2025",
    lastLogin: "Today at 10:45 AM",
    verificationStatus: "Verified",
    twoFactorEnabled: true,
    connectedWallets: 2,
    preferredCurrency: "USD",
    language: "English",
    theme: "System"
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="flex-1 space-y-6 p-6 md:p-8 pt-6 overflow-hidden"
    >
      {/* Header with title and action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <motion.div variants={item} className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </motion.div>
        
        <motion.div variants={item} className="flex items-center gap-3">
          {hasChanges && (
            <>
              <Button variant="outline" size="sm" onClick={() => setHasChanges(false)}>
                <Undo className="h-4 w-4 mr-2" />
                <span>Discard</span>
              </Button>
              <Button size="sm" onClick={() => setHasChanges(false)}>
                <Save className="h-4 w-4 mr-2" />
                <span>Save Changes</span>
              </Button>
            </>
          )}
        </motion.div>
      </div>

      {/* Account overview card */}
      <motion.div variants={item}>
        <Card className="p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 blur-3xl rounded-full -mr-32 -mt-32" />
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* User avatar and basic info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold">JD</span>
                </div>
                <Badge className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-background px-1">
                  <span className="sr-only">Verified</span>
                  <Shield className="h-3 w-3" />
                </Badge>
              </div>
              
              <div>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-muted-foreground">john.doe@example.com</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                    {accountData.accountType}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                    {accountData.verificationStatus}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Account stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">{accountData.memberSince}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Last Login</p>
                <p className="font-medium">{accountData.lastLogin}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Connected Wallets</p>
                <p className="font-medium">{accountData.connectedWallets}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">2FA Status</p>
                <p className="font-medium">{accountData.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main settings tabs */}
      <motion.div variants={item}>
        <Tabs 
          defaultValue="profile" 
          className="space-y-6"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setHasChanges(false);
          }}
        >
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="inline-flex w-full md:w-auto p-1">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Payment</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Brush className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings onChangesMade={() => setHasChanges(true)} />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings onChangesMade={() => setHasChanges(true)} />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings onChangesMade={() => setHasChanges(true)} />
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Payment Methods</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage your payment methods and preferences</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">MetaMask</p>
                        <p className="text-sm text-muted-foreground">0x71C7...976F</p>
                      </div>
                    </div>
                    <Badge>Primary</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Coinbase Wallet</p>
                        <p className="text-sm text-muted-foreground">0x3a8F...12eB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Set as Primary</Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <span>Connect New Wallet</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
            
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Payment Preferences</h3>
                <p className="text-sm text-muted-foreground mt-1">Configure your payment settings</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="font-medium">Default Currency</p>
                    <Badge variant="outline" className="text-sm">{accountData.preferredCurrency}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Automatic Payments</p>
                    <Badge variant="outline" className="text-sm bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">Enabled</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground mt-1">Customize how Scene Capital looks for you</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <p className="font-medium">Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="w-full h-20 rounded bg-white border"></div>
                        <p className="text-sm font-medium">Light</p>
                      </div>
                      <div className="border rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="w-full h-20 rounded bg-slate-900 border border-slate-800"></div>
                        <p className="text-sm font-medium">Dark</p>
                      </div>
                      <div className="border rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors border-primary/50 bg-primary/5">
                        <div className="w-full h-20 rounded bg-gradient-to-b from-white to-slate-900 border"></div>
                        <p className="text-sm font-medium">System</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Language</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">{accountData.language}</Badge>
                      <Button variant="link" size="sm" className="h-auto p-0">
                        Change Language
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Help and support section */}
      <motion.div variants={item}>
        <Card className="p-6 overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-50 blur-3xl rounded-full -mr-32 -mb-32" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Contact our support team for assistance</p>
              </div>
            </div>
            
            <Button variant="outline" className="md:self-end">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>Support Center</span>
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}