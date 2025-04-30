"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const assets = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    amount: "0.5432",
    value: "$21,543.67",
    change: "+5.2%"
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    amount: "2.3456",
    value: "$4,567.89",
    change: "+3.8%"
  }
];

export function WalletAssets() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>24h Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell className="font-medium">{asset.name} ({asset.symbol})</TableCell>
            <TableCell>{asset.amount}</TableCell>
            <TableCell>{asset.value}</TableCell>
            <TableCell className="text-green-600">{asset.change}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}