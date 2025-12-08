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
import { useTransactions } from "@/hooks/useTransactions";
import { useProfile } from "@/hooks/useProfile";
import { useBudgets } from "@/hooks/useBudgets";
import { useMemo } from "react";

export default function Dashboard() {
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { profile, isLoading: profileLoading } = useProfile();
  const { budget } = useBudgets();

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    
    const balance = income - expenses;
    const savings = income > 0 ? balance : 0;

    return { income, expenses, balance, savings };
  }, [transactions]);

  const userName = profile?.name?.split(" ")[0] || "User";

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
              Welcome back, <span className="gradient-text">{userName}</span>
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
          value={`₹${stats.balance.toLocaleString("en-IN")}`}
          change={stats.balance >= 0 ? "Positive balance" : "Negative balance"}
          changeType={stats.balance >= 0 ? "increase" : "decrease"}
          icon={Wallet}
          iconColor="primary"
          delay={0.1}
        />
        <StatsCard
          title="Monthly Income"
          value={`₹${stats.income.toLocaleString("en-IN")}`}
          change={transactions.length > 0 ? `${transactions.filter(t => t.type === "income").length} transactions` : "No income yet"}
          changeType="increase"
          icon={TrendingUp}
          iconColor="success"
          delay={0.2}
        />
        <StatsCard
          title="Monthly Expenses"
          value={`₹${stats.expenses.toLocaleString("en-IN")}`}
          change={transactions.length > 0 ? `${transactions.filter(t => t.type === "expense").length} transactions` : "No expenses yet"}
          changeType="decrease"
          icon={TrendingDown}
          iconColor="destructive"
          delay={0.3}
        />
        <StatsCard
          title="Total Savings"
          value={`₹${stats.savings.toLocaleString("en-IN")}`}
          change={budget ? `Budget: ₹${budget.toLocaleString("en-IN")}` : "No budget set"}
          changeType={stats.savings > 0 ? "increase" : "neutral"}
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
