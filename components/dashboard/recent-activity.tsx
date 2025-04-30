"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentActivity = [
  {
    id: 1,
    type: "Purchase",
    asset: "Bitcoin",
    amount: "$2,500",
    date: "2024-01-15",
    status: "Completed",
  },
  {
    id: 2,
    type: "Sale",
    asset: "Ethereum",
    amount: "$1,800",
    date: "2024-01-14",
    status: "Completed",
  },
  {
    id: 3,
    type: "Transfer",
    asset: "USDT",
    amount: "$5,000",
    date: "2024-01-13",
    status: "Pending",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          Your recent transactions and activities
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentActivity.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.type}</TableCell>
              <TableCell>{activity.asset}</TableCell>
              <TableCell>{activity.amount}</TableCell>
              <TableCell>{activity.date}</TableCell>
              <TableCell>{activity.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}