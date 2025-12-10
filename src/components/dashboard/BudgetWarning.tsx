import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { useLimits } from "@/hooks/useLimits";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo } from "react";

export function BudgetWarning() {
  const { monthlyLimit, dailyLimit } = useLimits();
  const { transactions } = useTransactions();

  const { monthlySpent, dailySpent } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const currentDay = now.toISOString().slice(0, 10);

    const expenses = transactions.filter((t) => t.type === "expense");

    const monthlySpent = expenses
      .filter((t) => t.rawDate?.startsWith(currentMonth))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const dailySpent = expenses
      .filter((t) => t.rawDate === currentDay)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { monthlySpent, dailySpent };
  }, [transactions]);

  const monthlyPercent = monthlyLimit 
    ? (monthlySpent / Number(monthlyLimit.limit_amount)) * 100 
    : 0;
  const dailyPercent = dailyLimit 
    ? (dailySpent / Number(dailyLimit.limit_amount)) * 100 
    : 0;

  const warnings = [];

  if (monthlyPercent >= 80) {
    warnings.push({
      type: "monthly",
      percent: monthlyPercent,
      spent: monthlySpent,
      limit: Number(monthlyLimit?.limit_amount || 0),
    });
  }

  if (dailyPercent >= 80) {
    warnings.push({
      type: "daily",
      percent: dailyPercent,
      spent: dailySpent,
      limit: Number(dailyLimit?.limit_amount || 0),
    });
  }

  if (warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      {warnings.map((warning) => (
        <motion.div
          key={warning.type}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            warning.percent >= 100
              ? "bg-destructive/10 border-destructive/30"
              : "bg-warning/10 border-warning/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              warning.percent >= 100 
                ? "bg-destructive/20 text-destructive" 
                : "bg-warning/20 text-warning"
            }`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${
                warning.percent >= 100 ? "text-destructive" : "text-warning"
              }`}>
                {warning.percent >= 100 
                  ? `${warning.type.charAt(0).toUpperCase() + warning.type.slice(1)} Budget Exceeded!`
                  : `Approaching ${warning.type.charAt(0).toUpperCase() + warning.type.slice(1)} Budget Limit`
                }
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                You've spent ₹{warning.spent.toLocaleString("en-IN")} of your 
                ₹{warning.limit.toLocaleString("en-IN")} {warning.type} budget 
                ({warning.percent.toFixed(1)}%)
              </p>
              <div className="mt-2 h-2 bg-background/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(warning.percent, 100)}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    warning.percent >= 100 
                      ? "bg-destructive" 
                      : "bg-warning"
                  }`}
                />
              </div>
            </div>
            <TrendingUp className={`h-5 w-5 ${
              warning.percent >= 100 ? "text-destructive" : "text-warning"
            }`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
