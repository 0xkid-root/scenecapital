"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CinematicHeader from "./cinematic-header";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  FolderKanban,
  History,
  Users,
  Settings,
  Sun,
  Moon,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileSignature,
  BarChart3,
  Store,
  Copy,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

const routes = [
  // Main Dashboard
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  
  // Creator Routes
  {
    label: "My Projects",
    icon: FolderKanban,
    href: "/dashboard/projects",
  },
  {
    label: "Royalty Income",
    icon: DollarSign,
    href: "/dashboard/royalties",
  },
  {
    label: "Licensing Deals",
    icon: FileSignature,
    href: "/dashboard/licensing",
  },
  
  // Investor Routes
  {
    label: "IP Portfolio",
    icon: BarChart3,
    href: "/dashboard/portfolio",
  },
  {
    label: "Marketplace",
    icon: Store,
    href: "/marketplace",
  },
  {
    label: "Orders",
    icon: DollarSign,
    href: "/dashboard/orders",
  },
  {
    label: "Transactions",
    icon: History,
    href: "/dashboard/transactions",
  },
  {
    label: "Wallet",
    icon: Wallet,
    href: "/dashboard/wallet",
  },
  
  // Community
  {
    label: "Community",
    icon: Users,
    href: "/community",
  },
  
  // Settings
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    
    // Notify parent component
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
    
    // Store in localStorage for persistence
    localStorage.setItem('sidebar-collapsed', String(newState));
    
    // Dispatch event for other components to listen
    window.dispatchEvent(new Event('sidebar-state-change'));
  };

  useEffect(() => {
    // Check localStorage for saved state
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      const collapsed = savedState === 'true';
      setIsCollapsed(collapsed);
      if (onCollapseChange) {
        onCollapseChange(collapsed);
      }
    }
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        if (onCollapseChange) {
          onCollapseChange(true);
        }
        localStorage.setItem('sidebar-collapsed', 'true');
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [onCollapseChange]);

  useEffect(() => {
    // Check if wallet is connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          console.error('Failed to get accounts:', err);
        }
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });
    }
  }, []);

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-screen bg-white dark:bg-slate-900 border-r shadow-md transition-all duration-300 ease-in-out fixed top-0 left-0 z-50",
          isCollapsed ? "w-16" : "w-80"
        )}
        role="navigation"
        aria-label="Main Navigation"
      >
        {/* Enhanced Cinematic Header with Logo */}
        <CinematicHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-2 overflow-y-auto">
          <nav>
            <ul className="space-y-1.5" role="menu">
            {routes.map((route) => (
              <Tooltip key={route.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      "group flex items-center p-2.5 rounded-lg transition-all duration-200",
                      pathname === route.href
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border-l-2 border-indigo-600"
                        : "text-muted-foreground hover:bg-indigo-200 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-300",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                    aria-current={pathname === route.href ? "page" : undefined}
                    role="menuitem"
                    aria-label={route.label}
                  >
                    <route.icon
                      className={cn(
                        "h-5 w-5",
                        isCollapsed ? "mr-0" : "mr-3",
                        pathname === route.href ? "text-indigo-700 dark:text-indigo-200" : ""
                      )}
                      aria-hidden="true"
                    />
                    {!isCollapsed && (
                      <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {route.label}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{route.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
            </ul>
          </nav>
        </div>

        {/* Profile Section with Theme and Notification Buttons */}
        <div className="px-3 py-4 border-t" role="complementary" aria-label="User Profile">
          <div className={cn("space-y-4", isCollapsed ? "text-center" : "")}>
            <div
              className={cn(
                "flex items-center",
                isCollapsed ? "flex-col space-y-2" : "space-x-3 p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800"
              )}
            >
              <Avatar className={cn(isCollapsed ? "h-8 w-8" : "h-10 w-10")}>
                <AvatarImage src="/avatar-placeholder.png" alt="Profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
                  {walletAddress ? (
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-mono text-muted-foreground">
                        {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 hover:bg-transparent"
                        onClick={copyAddress}
                      >
                        {isCopied ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not Connected</p>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                      className={cn(
                        "hover:bg-indigo-100 dark:hover:bg-slate-800 transition-transform hover:scale-110",
                        theme === "light" ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : ""
                      )}
                      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                      aria-pressed={theme === "dark"}
                    >
                      {theme === "light" ? <Moon className="h-5 w-5" aria-hidden="true" /> : <Sun className="h-5 w-5" aria-hidden="true" />}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{theme === "light" ? "Dark Mode" : "Light Mode"}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-indigo-100 dark:hover:bg-slate-800 transition-transform hover:scale-110"
                      aria-label="Notifications"
                    >
                      <Bell className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>Notifications</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        
        {/* Innovative Logout Section at Bottom */}
        <div className="mt-auto px-3 py-4 border-t" role="complementary" aria-label="Logout">
          <motion.div 
            className={cn(
              "relative overflow-hidden",
              isCollapsed ? "mx-auto w-10 h-10" : "mx-auto w-full h-12"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full relative group transition-all duration-300",
                isCollapsed ? "h-10 p-0" : "h-12",
                "bg-gradient-to-r from-red-500/10 to-transparent hover:from-red-500/20 hover:to-transparent"
              )}
              onClick={handleLogout}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-red-500"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
              <div className="flex items-center justify-center space-x-2">
                <LogOut className={cn(
                  "text-red-500",
                  isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-2"
                )} 
                aria-hidden="true" />
                {!isCollapsed && (
                  <span className="font-medium text-red-500">Exit Studio</span>
                )}
              </div>
            </Button>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}