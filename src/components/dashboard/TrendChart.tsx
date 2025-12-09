import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo } from "react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border border-primary/20">
        <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-success">Income: </span>
            <span className="font-display font-bold text-foreground">
              ₹{payload[0]?.value?.toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-destructive">Expenses: </span>
            <span className="font-display font-bold text-foreground">
              ₹{payload[1]?.value?.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function TrendChart() {
  const { transactions, isLoading } = useTransactions();

  const data = useMemo(() => {
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    
    // Get last 6 months
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months.push(monthKey);
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    transactions.forEach((t) => {
      const txDate = new Date(t.rawDate);
      const monthKey = txDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      
      if (monthlyData[monthKey]) {
        if (t.type === "income") {
          monthlyData[monthKey].income += t.amount;
        } else {
          monthlyData[monthKey].expenses += t.amount;
        }
      }
    });

    return months.map((month) => ({
      month,
      income: monthlyData[month].income,
      expenses: monthlyData[month].expenses,
    }));
  }, [transactions]);

  if (isLoading) {
    return (
      <motion.div className="glass-card p-6 h-[380px] animate-pulse">
        <div className="h-4 w-40 bg-muted rounded mb-4" />
        <div className="h-[300px] bg-muted/50 rounded" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Income vs Expenses Trend
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 46%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142 76% 46%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(270 100% 71%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(270 100% 71%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(224 30% 25%)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="hsl(215 20.2% 65.1%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215 20.2% 65.1%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(142 76% 46%)"
              strokeWidth={3}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(270 100% 71%)"
              strokeWidth={3}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}
