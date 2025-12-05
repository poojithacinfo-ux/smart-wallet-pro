import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

const categories: BudgetCategory[] = [
  { name: "Food & Dining", spent: 850, budget: 1000, color: "bg-primary" },
  { name: "Transportation", spent: 420, budget: 500, color: "bg-accent" },
  { name: "Entertainment", spent: 280, budget: 300, color: "bg-secondary" },
  { name: "Shopping", spent: 650, budget: 600, color: "bg-destructive" },
  { name: "Bills", spent: 1200, budget: 1500, color: "bg-success" },
];

export function BudgetProgress() {
  const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);
  const totalBudget = categories.reduce((acc, cat) => acc + cat.budget, 0);
  const overallProgress = (totalSpent / totalBudget) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Budget Overview
        </h3>
        <span className="text-sm text-muted-foreground">
          ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
        </span>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Overall Budget
          </span>
          <span
            className={cn(
              "text-sm font-bold",
              overallProgress > 90 ? "text-destructive" : "text-success"
            )}
          >
            {overallProgress.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(overallProgress, 100)}%` }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full relative",
              overallProgress > 90
                ? "bg-gradient-to-r from-warning to-destructive"
                : "bg-gradient-to-r from-primary to-accent"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="space-y-4">
        {categories.map((category, index) => {
          const progress = (category.spent / category.budget) * 100;
          const isOverBudget = progress > 100;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-muted-foreground">
                  {category.name}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isOverBudget ? "text-destructive" : "text-foreground"
                  )}
                >
                  ${category.spent} / ${category.budget}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                  className={cn(
                    "h-full rounded-full transition-all",
                    isOverBudget ? "bg-destructive" : category.color
                  )}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
