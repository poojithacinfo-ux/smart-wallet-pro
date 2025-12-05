import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jul", income: 4800, expenses: 3200, savings: 1600 },
  { month: "Aug", income: 5200, expenses: 3800, savings: 1400 },
  { month: "Sep", income: 4900, expenses: 3500, savings: 1400 },
  { month: "Oct", income: 5500, expenses: 3900, savings: 1600 },
  { month: "Nov", income: 6100, expenses: 4200, savings: 1900 },
  { month: "Dec", income: 6500, expenses: 4500, savings: 2000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border border-primary/20">
        <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((p: any, index: number) => (
            <p key={index} className="text-sm">
              <span style={{ color: p.fill }}>{p.name}: </span>
              <span className="font-display font-bold text-foreground">
                ₹{p.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Deep dive into your financial patterns and insights.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="glass-card p-6 neon-glow">
          <p className="text-sm text-muted-foreground">Average Monthly Income</p>
          <p className="font-display text-3xl font-bold text-success mt-2">
            ₹5,500
          </p>
          <p className="text-xs text-success mt-1">+8.2% vs last 6 months</p>
        </div>
        <div className="glass-card p-6 neon-glow-purple">
          <p className="text-sm text-muted-foreground">Average Monthly Expenses</p>
          <p className="font-display text-3xl font-bold text-accent mt-2">
            ₹3,850
          </p>
          <p className="text-xs text-muted-foreground mt-1">Stable trend</p>
        </div>
        <div className="glass-card p-6 neon-glow-success">
          <p className="text-sm text-muted-foreground">Average Monthly Savings</p>
          <p className="font-display text-3xl font-bold text-foreground mt-2">
            ₹1,650
          </p>
          <p className="text-xs text-success mt-1">+12.5% improvement</p>
        </div>
      </motion.div>

      {/* Monthly Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-8"
      >
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Monthly Financial Overview
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barGap={8}>
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
              <Bar
                dataKey="income"
                name="Income"
                fill="hsl(142 76% 46%)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="hsl(270 100% 71%)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="savings"
                name="Savings"
                fill="hsl(208 100% 61%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
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
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Savings</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingChart />
        <TrendChart />
      </div>

      {/* Budget Progress */}
      <BudgetProgress />
    </DashboardLayout>
  );
}
