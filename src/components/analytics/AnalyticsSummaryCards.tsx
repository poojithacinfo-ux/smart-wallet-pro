import { motion } from "framer-motion";
import { useAnalyticsSummary } from "@/hooks/useAnalytics";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

interface AnalyticsSummaryCardsProps {
  from?: string;
  to?: string;
}

export function AnalyticsSummaryCards({ from, to }: AnalyticsSummaryCardsProps) {
  const { data: summary, isLoading } = useAnalyticsSummary(from, to);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded mb-2" />
            <div className="h-8 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Income",
      value: summary?.totalIncome ?? 0,
      icon: TrendingUp,
      className: "neon-glow",
      valueClass: "text-success",
      iconClass: "text-success",
    },
    {
      title: "Total Expenses",
      value: summary?.totalExpense ?? 0,
      icon: TrendingDown,
      className: "neon-glow-purple",
      valueClass: "text-accent",
      iconClass: "text-accent",
    },
    {
      title: "Balance",
      value: summary?.balance ?? 0,
      icon: Wallet,
      className: "neon-glow-success",
      valueClass: (summary?.balance ?? 0) >= 0 ? "text-success" : "text-destructive",
      iconClass: "text-primary",
    },
    {
      title: "Budget Used",
      value: summary?.budgetUsedPercentage ?? 0,
      icon: Target,
      className: "glass-card",
      valueClass:
        (summary?.budgetUsedPercentage ?? 0) >= 80
          ? "text-destructive"
          : (summary?.budgetUsedPercentage ?? 0) >= 50
          ? "text-warning"
          : "text-success",
      iconClass: "text-primary",
      isPercentage: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          className={`${card.className} p-6`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <card.icon className={`h-5 w-5 ${card.iconClass}`} />
          </div>
          <p className={`font-display text-3xl font-bold ${card.valueClass}`}>
            {card.isPercentage
              ? `${card.value}%`
              : `₹${card.value.toLocaleString("en-IN")}`}
          </p>
          {card.title === "Budget Used" && summary?.budget && (
            <p className="text-xs text-muted-foreground mt-1">
              of ₹{summary.budget.toLocaleString("en-IN")} budget
            </p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
