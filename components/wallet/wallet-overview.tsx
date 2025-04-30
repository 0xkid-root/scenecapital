"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, Wallet } from "lucide-react";

export function WalletOverview() {
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
            <h3 className="text-2xl font-bold">$12,345.67</h3>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex items-center pt-4 text-sm text-green-600">
          <ArrowUpRight className="mr-1 h-4 w-4" />
          <span>+8.2% from last week</span>
        </div>
      </Card>
    </>
  );
}