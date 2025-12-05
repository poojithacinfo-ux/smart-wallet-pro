import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Calendar, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "danger" | "reminder" | "info";
  title: string;
  description: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Budget Warning",
    description: "You've used 85% of your monthly budget",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "danger",
    title: "Overspending Alert",
    description: "Entertainment spending exceeded by ₹150",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "reminder",
    title: "Bill Reminder",
    description: "Electricity bill due in 3 days - ₹125",
    time: "1 day ago",
  },
  {
    id: "4",
    type: "info",
    title: "Savings Goal",
    description: "You're 70% towards your vacation fund!",
    time: "2 days ago",
  },
];

const alertStyles = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconColor: "text-warning",
    glow: "hover:shadow-[0_0_20px_hsl(38_92%_50%/0.2)]",
  },
  danger: {
    icon: TrendingDown,
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    iconColor: "text-destructive",
    glow: "hover:shadow-neon-destructive",
  },
  reminder: {
    icon: Calendar,
    bg: "bg-primary/10",
    border: "border-primary/30",
    iconColor: "text-primary",
    glow: "hover:shadow-neon-blue",
  },
  info: {
    icon: Bell,
    bg: "bg-success/10",
    border: "border-success/30",
    iconColor: "text-success",
    glow: "hover:shadow-neon-success",
  },
};

export function AlertPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Smart Alerts
        </h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
          {alerts.length}
        </span>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-glass pr-2">
        {alerts.map((alert, index) => {
          const style = alertStyles[alert.type];
          const Icon = style.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={cn(
                "flex items-start gap-3 rounded-xl p-4 border transition-all duration-300 cursor-pointer",
                style.bg,
                style.border,
                style.glow
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  style.bg
                )}
              >
                <Icon className={cn("h-5 w-5", style.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {alert.description}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {alert.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
