import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTopCategories } from "@/hooks/useAnalytics";

interface TopCategoriesChartProps {
  from?: string;
  to?: string;
}

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border border-primary/20">
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="font-display text-lg font-bold text-foreground">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export function TopCategoriesChart({ from, to }: TopCategoriesChartProps) {
  const { topCategories, isLoading } = useTopCategories(5, from, to);

  if (isLoading) {
    return (
      <motion.div className="glass-card p-6 mb-8 h-[350px] animate-pulse">
        <div className="h-4 w-48 bg-muted rounded mb-4" />
        <div className="h-[280px] bg-muted/50 rounded" />
      </motion.div>
    );
  }

  if (topCategories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-8"
      >
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Top 5 Spending Categories
        </h3>
        <div className="h-[280px] flex items-center justify-center text-muted-foreground">
          No expense data yet. Add transactions to see your top spending categories.
        </div>
      </motion.div>
    );
  }

  const chartData = topCategories.map((cat) => ({
    name: cat.category,
    amount: cat.amount,
    fill: CATEGORY_COLORS[cat.category] || CATEGORY_COLORS["Others"],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 mb-8"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Top 5 Spending Categories
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barGap={8}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(224 30% 25%)"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="hsl(215 20.2% 65.1%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(215 20.2% 65.1%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="amount"
              radius={[0, 6, 6, 0]}
              fill="hsl(208 100% 61%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
