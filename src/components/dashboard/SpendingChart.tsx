import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "hsl(208 100% 61%)",
  "Transportation": "hsl(270 100% 71%)",
  "Entertainment": "hsl(208 100% 89%)",
  "Shopping": "hsl(142 76% 46%)",
  "Bills & Utilities": "hsl(38 92% 50%)",
  "Healthcare": "hsl(0 84% 60%)",
  "Education": "hsl(280 100% 70%)",
  "Travel": "hsl(190 90% 50%)",
  "Others": "hsl(224 30% 50%)",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-primary/20">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-lg font-display font-bold text-primary">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export function SpendingChart() {
  const { transactions, isLoading } = useTransactions();

  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS["Others"],
    }));
  }, [transactions]);

  if (isLoading) {
    return (
      <motion.div className="glass-card p-6 h-[380px] animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="h-[300px] bg-muted/50 rounded" />
      </motion.div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Spending by Category
        </h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No expense data yet. Add transactions to see your spending breakdown.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Spending by Category
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
