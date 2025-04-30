"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data for different time periods
const monthlyData = [
  { month: "Jan", investments: 4000, returns: 2400 },
  { month: "Feb", investments: 3000, returns: 1398 },
  { month: "Mar", investments: 2000, returns: 9800 },
  { month: "Apr", investments: 2780, returns: 3908 },
  { month: "May", investments: 1890, returns: 4800 },
  { month: "Jun", investments: 2390, returns: 3800 },
];

const quarterlyData = [
  { quarter: "Q1", investments: 9000, returns: 13598 },
  { quarter: "Q2", investments: 7060, returns: 12508 },
];

const yearlyData = [
  { year: "2025", investments: 16060, returns: 26106 },
];

// Utility to calculate summary stats
const calculateSummary = (data: any[]) => {
  const totalInvestments = data.reduce((sum, item) => sum + item.investments, 0);
  const totalReturns = data.reduce((sum, item) => sum + item.returns, 0);
  const averageReturns = totalReturns / data.length;
  return { totalInvestments, averageReturns };
};

export function Analytics() {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [timePeriod, setTimePeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  // Select data based on time period
  const data = timePeriod === "monthly" ? monthlyData : timePeriod === "quarterly" ? quarterlyData : yearlyData;
  const xAxisKey = timePeriod === "monthly" ? "month" : timePeriod === "quarterly" ? "quarter" : "year";
  const summary = calculateSummary(data);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Investment Analytics</h3>
        <div className="flex space-x-2">
          <Select onValueChange={(value: "monthly" | "quarterly" | "yearly") => setTimePeriod(value)} defaultValue="monthly">
            <SelectTrigger className="w-[120px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            {chartType === "bar" ? "Switch to Line" : "Switch to Bar"}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Investments</p>
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
            ${summary.totalInvestments.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Average Returns</p>
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
            ${Math.round(summary.averageReturns).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] sm:h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              aria-label="Bar chart showing investments and returns over time"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={xAxisKey} stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="investments"
                fill="#2563eb"
                name="Investments"
                className="hover:fill-blue-700 transition-all duration-200"
              />
              <Bar
                dataKey="returns"
                fill="#16a34a"
                name="Returns"
                className="hover:fill-green-600 transition-all duration-200"
              />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              aria-label="Line chart showing investments and returns over time"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={xAxisKey} stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="investments"
                stroke="#2563eb"
                name="Investments"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#16a34a"
                name="Returns"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}