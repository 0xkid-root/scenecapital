"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clapperboard, ChevronLeft, ChevronRight, Film, Star, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function CinematicHeader({ isCollapsed, toggleSidebar }: CinematicHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  // Trigger logo loaded animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setLogoLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants for staggered logo reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="px-4 py-4 flex items-center justify-between bg-gradient-to-b from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm shadow-lg relative overflow-hidden">
      {/* Film grain overlay for cinematic effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Subtle light beam effect */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 dark:bg-blue-400/5 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 dark:bg-amber-400/5 blur-3xl rounded-full pointer-events-none"></div>

      {/* Logo Section */}
      {isCollapsed ? (
        <div className="flex items-center justify-center w-full">
          <motion.div 
            className="relative flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Background glow */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-amber-500/20 dark:from-blue-600/10 dark:to-amber-500/10 rounded-full blur-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 0.8 : 0.2,
                scale: isHovered ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10 flex items-center gap-2 p-1">
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent drop-shadow-sm"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                S.C
              </motion.span>
            </div>
          </motion.div>
        </div>
      ) : (
        <Link href="/dashboard" className="flex items-center">
          <motion.div
            className="relative group"
            initial="hidden"
            animate={logoLoaded ? "visible" : "hidden"}
            variants={containerVariants}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Background card effect */}
            <motion.div 
              className="absolute -inset-2 bg-gradient-to-r from-blue-600/5 to-amber-500/5 dark:from-blue-600/10 dark:to-amber-500/10 rounded-lg blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10 flex items-center gap-3 px-2 py-1">
              {/* Logo icon with animation */}
              <motion.div
                className="relative"
                variants={itemVariants}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isHovered ? 360 : 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <Clapperboard className="h-6 w-6 text-amber-500 drop-shadow-md" />
                </motion.div>
                
                {/* Film reel background effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -inset-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 z-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Logo text with staggered animation */}
              <div className="flex items-center">
                <motion.span 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm"
                  variants={itemVariants}
                >
                  Scene
                </motion.span>
                
                <motion.div
                  className="relative mx-1"
                  variants={itemVariants}
                >
                  <span className="text-2xl font-bold text-amber-500">
                    .
                  </span>
                  
                  {/* Star burst effect on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute -inset-1 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Star className="absolute h-3 w-3 text-amber-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <motion.div className="relative flex items-center">
                  <motion.span 
                    className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm"
                    variants={itemVariants}
                  >
                    Capital
                  </motion.span>
                  
                  {/* Finance icon on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute -right-4 -top-2"
                        initial={{ opacity: 0, scale: 0, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 10 }}
                        transition={{ delay: 0.2 }}
                      >
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Toggle Button with Cinematic Effect */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="relative border-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-border rounded-lg p-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className="flex items-center justify-center bg-white dark:bg-slate-900 rounded-md w-10 h-10 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"
            animate={{ opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6 text-blue-600 relative z-10" />
          ) : (
            <ChevronLeft className="h-6 w-6 text-purple-600 relative z-10" />
          )}
        </div>
      </Button>
    </div>
  );
}
