import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, TrendingUp, DollarSign, Clock } from 'lucide-react';

const stats = [
  {
    title: "Total Invested",
    value: "$250,000",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Active Investments",
    value: "8",
    change: "+2",
    icon: TrendingUp,
    trend: "up"
  },
  {
    title: "Average ROI",
    value: "15.2%",
    change: "+2.3%",
    icon: ArrowUpRight,
    trend: "up"
  }
];

export function PortfolioStats() {
  return (
    <>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-medium">{stat.title}</h3>
                  </div>
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </>
  );
}
