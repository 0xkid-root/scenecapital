"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: React.ReactNode;
}

export function AnimatedCard({ delay = 0, className, children, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <Card 
        className={cn(
          "overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 hover:shadow-lg transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}