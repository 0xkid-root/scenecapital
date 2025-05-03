"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DollarSign, TrendingUp, Clock, Wallet, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Project } from "@/types/project";

interface InvestModalProps {
  project: Project;
  onClose: () => void;
}

export function InvestModal({ project, onClose }: InvestModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState(1000);

  const handleInvest = () => {
    // Add your investment logic here
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-card dark:glass-card-dark border-none shadow-float overflow-hidden p-0">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Invest in {project.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Choose how much you want to invest in this project.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label
                htmlFor="investment-amount"
                className="text-sm font-medium"
              >
                Investment Amount
              </label>
              <motion.span 
                key={investmentAmount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-lg font-bold gradient-text"
              >
                ${investmentAmount.toLocaleString()}
              </motion.span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <Input
                id="investment-amount"
                type="number"
                value={investmentAmount}
                onChange={(e) =>
                  setInvestmentAmount(parseInt(e.target.value) || 0)
                }
                className="flex-1 glass-card dark:glass-card-dark border-border/50"
              />
            </div>
            <Slider
              value={[investmentAmount]}
              min={1000}
              max={100000}
              step={1000}
              onValueChange={(value) => setInvestmentAmount(value[0])}
              className="mt-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-secondary/10">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected Returns</p>
                  <p className="font-bold">{project.returns}%</p>
                </div>
              </div>
            </div>
            <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="font-bold">{project.timeline}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card dark:glass-card-dark p-5 rounded-lg space-y-3">
            <h4 className="text-sm font-medium">Investment Summary</h4>
            <div className="flex justify-between text-sm border-b border-border/30 pb-2">
              <span className="text-muted-foreground">Your investment</span>
              <span className="font-medium">${investmentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pb-2">
              <span className="text-muted-foreground">Expected return</span>
              <span className="font-medium text-green-600">
                ${Math.round(investmentAmount * (project.returns / 100)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total after {project.timeline}</span>
              <span className="font-bold gradient-text">
                ${Math.round(investmentAmount * (1 + project.returns / 100)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleInvest} 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-float"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Invest Now
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}