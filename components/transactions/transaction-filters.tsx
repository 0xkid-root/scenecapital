"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TransactionFiltersProps = {
  currentFilter: string;
  onFilterChange: (value: string) => void;
};

export function TransactionFilters({ currentFilter, onFilterChange }: TransactionFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <Select value={currentFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Transactions</SelectItem>
          <SelectItem value="investment">Investment</SelectItem>
          <SelectItem value="withdrawal">Withdrawal</SelectItem>
          <SelectItem value="transfer">Transfer</SelectItem>
        </SelectContent>
      </Select>
      
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => onFilterChange("all")}>Reset Filters</Button>
    </div>
  );
}