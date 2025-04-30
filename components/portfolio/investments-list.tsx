"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Investment {
  id: string;
  name: string;
  amount: number;
  returns: number;
  status: 'active' | 'completed';
  type: 'residential' | 'commercial' | 'retail';
  location: string;
  investmentDate: string;
}

const investments: Investment[] = [
  {
    id: '1',
    name: 'Urban Heights Development',
    amount: 25000,
    returns: 15.4,
    status: 'active',
    type: 'residential',
    location: 'Downtown Metro',
    investmentDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Tech Park Office Complex',
    amount: 15000,
    returns: 12.8,
    status: 'active',
    type: 'commercial',
    location: 'Innovation District',
    investmentDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Retail Plaza',
    amount: 10000,
    returns: 8.5,
    status: 'active',
    type: 'retail',
    location: 'City Center',
    investmentDate: '2024-03-10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export function InvestmentsList() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Active Investments</h3>
      <motion.div 
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {investments.map((investment) => (
          <motion.div
            key={investment.id}
            variants={item}
            className="group"
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full mt-1">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {investment.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {investment.location}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {investment.type}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">+{investment.returns}%</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(investment.investmentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${investment.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
}