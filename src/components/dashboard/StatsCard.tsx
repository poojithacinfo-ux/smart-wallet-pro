import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "success" | "destructive" | "accent" | "warning";
  delay?: number;
}

const iconColorClasses = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  destructive: "text-destructive bg-destructive/10",
  accent: "text-accent bg-accent/10",
  warning: "text-warning bg-warning/10",
};

const glowClasses = {
  primary: "neon-glow",
  success: "neon-glow-success",
  destructive: "neon-glow-destructive",
  accent: "neon-glow-purple",
  warning: "",
};

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "primary",
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={cn("glass-card p-6 group cursor-pointer", glowClasses[iconColor])}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="font-display text-3xl font-bold text-foreground">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "mt-2 text-sm font-medium flex items-center gap-1",
                changeType === "increase" && "text-success",
                changeType === "decrease" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {changeType === "increase" && "↑"}
              {changeType === "decrease" && "↓"}
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
            iconColorClasses[iconColor]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
