"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card className="p-4">
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1
        }}
        className="space-y-3"
      >
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </motion.div>
    </Card>
  );
}