"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  direction: 'inbound' | 'outbound';
}

type TransactionsListProps = {
  filter: string;
};

export function TransactionsList({ filter }: TransactionsListProps) {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2024-01-20",
      type: "Investment",
      amount: 5000,
      status: "completed",
      direction: "outbound"
    },
    {
      id: "2",
      date: "2024-01-18",
      type: "Dividend",
      amount: 250,
      status: "completed",
      direction: "inbound"
    },
    {
      id: "3",
      date: "2024-01-15",
      type: "Investment",
      amount: 3000,
      status: "pending",
      direction: "outbound"
    }
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {transactions.map((transaction) => (
              <motion.tr
                key={transaction.id}
                variants={item}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {transaction.direction === 'inbound' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-blue-500" />
                  )}
                  <span className={transaction.direction === 'inbound' ? 'text-green-600' : 'text-blue-600'}>
                    ${transaction.amount.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      transaction.status === 'completed' ? 'default' :
                      transaction.status === 'pending' ? 'secondary' : 'destructive'
                    }
                    className="capitalize"
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </motion.tr>
            ))}
          </motion.div>
        </TableBody>
      </Table>
    </div>
  );
}