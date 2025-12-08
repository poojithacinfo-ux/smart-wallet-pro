import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Alert {
  id: string;
  type: "warning" | "danger" | "reminder" | "info";
  title: string;
  description: string;
  time: string;
}

const alertTypeMapping: Record<string, "warning" | "danger" | "reminder" | "info"> = {
  overspending: "danger",
  low_balance: "warning",
  bill_reminder: "reminder",
};

export function useAlerts() {
  const { user } = useAuth();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["alerts", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map((alert) => {
        const createdAt = new Date(alert.created_at);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let time = "";
        if (diffHours < 1) {
          time = "Just now";
        } else if (diffHours < 24) {
          time = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        } else {
          time = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        }

        const typeText = alert.type.replace("_", " ");
        const title = typeText.charAt(0).toUpperCase() + typeText.slice(1);

        return {
          id: alert.id,
          type: alertTypeMapping[alert.type] || "info",
          title: title,
          description: alert.message,
          time,
        };
      });
    },
    enabled: !!user,
  });

  return { alerts, isLoading };
}
