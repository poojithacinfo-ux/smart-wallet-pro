import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Calendar, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlerts, Alert } from "@/hooks/useAlerts";

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
  const { alerts, isLoading } = useAlerts();

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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Alerts will appear here when you have budget warnings or bill reminders
            </p>
          </div>
        ) : (
          alerts.map((alert, index) => {
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
          })
        )}
      </div>
    </motion.div>
  );
}
