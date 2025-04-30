"use client";

import { TransactionsList } from "@/components/transactions/transactions-list";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { useState } from "react";

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      </div>

      <TransactionFilters currentFilter={filter} onFilterChange={setFilter} />
      <TransactionsList filter={filter} />
    </div>
  );
}