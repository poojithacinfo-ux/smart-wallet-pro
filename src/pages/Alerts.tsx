import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Check,
  Trash2,
  Settings,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "danger" | "reminder" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Budget Warning",
    description:
      "You've used 85% of your monthly budget. Consider reducing expenses to stay on track.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "danger",
    title: "Overspending Alert",
    description:
      "Your Entertainment spending has exceeded the budget by ₹150. Review your recent transactions.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "reminder",
    title: "Bill Reminder",
    description:
      "Electricity bill of ₹125 is due in 3 days. Make sure you have sufficient funds.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Savings Goal Progress",
    description:
      "Great news! You're 70% towards your vacation fund goal. Keep up the good work!",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "reminder",
    title: "Subscription Renewal",
    description:
      "Netflix subscription (₹199) will renew in 5 days. Cancel if not needed.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "6",
    type: "warning",
    title: "Low Balance Warning",
    description:
      "Your checking account balance is below ₹500. Consider transferring funds.",
    time: "4 days ago",
    read: true,
  },
];

const alertStyles = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconColor: "text-warning",
    glow: "hover:shadow-[0_0_20px_hsl(38_92%_50%/0.3)]",
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

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = alerts.filter((a) => !a.read).length;
  const filteredAlerts =
    filter === "unread" ? alerts.filter((a) => !a.read) : alerts;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

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
              Smart Alerts
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay on top of your finances with intelligent notifications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="default">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="hero" size="default">
              <Plus className="h-4 w-4" />
              Custom Alert
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Total Alerts</p>
          <p className="font-display text-2xl font-bold text-foreground mt-1">
            {alerts.length}
          </p>
        </div>
        <div className="glass-card p-4 neon-glow-destructive">
          <p className="text-sm text-muted-foreground">Unread</p>
          <p className="font-display text-2xl font-bold text-destructive mt-1">
            {unreadCount}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Warnings</p>
          <p className="font-display text-2xl font-bold text-warning mt-1">
            {alerts.filter((a) => a.type === "warning" || a.type === "danger").length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Reminders</p>
          <p className="font-display text-2xl font-bold text-primary mt-1">
            {alerts.filter((a) => a.type === "reminder").length}
          </p>
        </div>
      </motion.div>

      {/* Filter & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex gap-2 p-1 rounded-xl bg-muted">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize",
                filter === f
                  ? "bg-primary/20 text-primary shadow-neon-blue"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          const style = alertStyles[alert.type];
          const Icon = style.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={cn(
                "glass-card p-5 flex items-start gap-4 border transition-all duration-300",
                style.border,
                style.glow,
                !alert.read && "ring-2 ring-primary/20"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  style.bg
                )}
              >
                <Icon className={cn("h-6 w-6", style.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-foreground">
                        {alert.title}
                      </h3>
                      {!alert.read && (
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {alert.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-success hover:bg-success/10 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              No alerts
            </h3>
            <p className="text-muted-foreground mt-1">
              {filter === "unread"
                ? "You're all caught up!"
                : "No alerts to display."}
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
