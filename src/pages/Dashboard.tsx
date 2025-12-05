import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back, <span className="gradient-text">Alex</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your finances today.
            </p>
          </div>
          <Link to="/transactions">
            <Button variant="hero" size="lg">
              <span>Add Transaction</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Balance"
          value="$24,580"
          change="+2.5% from last month"
          changeType="increase"
          icon={Wallet}
          iconColor="primary"
          delay={0.1}
        />
        <StatsCard
          title="Monthly Income"
          value="$8,450"
          change="+12.3% from last month"
          changeType="increase"
          icon={TrendingUp}
          iconColor="success"
          delay={0.2}
        />
        <StatsCard
          title="Monthly Expenses"
          value="$5,320"
          change="-8.1% from last month"
          changeType="decrease"
          icon={TrendingDown}
          iconColor="destructive"
          delay={0.3}
        />
        <StatsCard
          title="Total Savings"
          value="$3,130"
          change="+$520 this month"
          changeType="increase"
          icon={PiggyBank}
          iconColor="accent"
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingChart />
        <TrendChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgress />
        <AlertPanel />
      </div>
    </DashboardLayout>
  );
}
