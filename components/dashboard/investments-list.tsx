"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Investment {
  id: string;
  name: string;
  amount: number;
  change: number;
  status: "up" | "down";
}

export function InvestmentsList() {
  const investments: Investment[] = [
    {
      id: "1",
      name: "Creative Tech Fund",
      amount: 5000,
      change: 12.5,
      status: "up"
    },
    {
      id: "2",
      name: "Digital Arts Portfolio",
      amount: 3200,
      change: -2.3,
      status: "down"
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Active Investments</h3>
      <div className="space-y-4">
        {investments.map((investment) => (
          <div key={investment.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <h4 className="font-medium">{investment.name}</h4>
              <p className="text-sm text-muted-foreground">${investment.amount.toLocaleString()}</p>
            </div>
            <div className={`flex items-center ${investment.status === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {investment.status === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="text-sm">{investment.change}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}