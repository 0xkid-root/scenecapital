"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Building, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const portfolioData = {
  totalValue: 45231.89,
  monthlyChange: 15.3,
  properties: [
    { name: "Urban Heights", value: 25000, change: 8.5, type: "Residential" },
    { name: "Tech Park Office", value: 15000, change: 12.3, type: "Commercial" },
    { name: "Retail Plaza", value: 5231.89, change: -2.1, type: "Retail" },
  ]
};

export function PortfolioOverview() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-modern opacity-10 blur-2xl rounded-full -mr-16 -mt-16" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
              <motion.h3 
                className="text-3xl font-bold bg-gradient-modern bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                ${portfolioData.totalValue.toLocaleString()}
              </motion.h3>
            </div>
            <motion.div 
              className="bg-primary/10 p-3 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="h-5 w-5 text-primary" />
            </motion.div>
          </div>
          <motion.div 
            className="flex items-center pt-4 text-sm text-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>+{portfolioData.monthlyChange}%</span>
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h4 className="text-lg font-semibold mb-4">Property Breakdown</h4>
        <div className="space-y-4">
          {portfolioData.properties.map((property, index) => (
            <motion.div
              key={property.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-muted-foreground">{property.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${property.value.toLocaleString()}</p>
                    <p className={`text-sm ${property.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {property.change >= 0 ? '+' : ''}{property.change}%
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}