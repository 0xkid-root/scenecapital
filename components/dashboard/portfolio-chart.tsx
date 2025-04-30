"use client";

import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PortfolioChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [1000, 1500, 1300, 1700, 2100, 2500],
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={{ responsive: true }} />
      </CardContent>
    </Card>
  );
}