import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Alert {
  id: string;
  type: "warning" | "danger" | "reminder" | "info";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  createdAt: string;
}

const alertTypeMapping: Record<string, "warning" | "danger" | "reminder" | "info"> = {
  overspending: "danger",
  low_balance: "warning",
  bill_reminder: "reminder",
};

export function useAlerts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["alerts", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

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
          isRead: alert.is_read,
          createdAt: alert.created_at,
        };
      });
    },
    enabled: !!user,
  });

  const markAsRead = useMutation({
    mutationFn: async (alertId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("alerts")
        .update({ is_read: true })
        .eq("id", alertId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (alertId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("alerts")
        .delete()
        .eq("id", alertId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({
        title: "Alert dismissed",
        description: "The alert has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return {
    alerts,
    isLoading,
    markAsRead: markAsRead.mutate,
    deleteAlert: deleteAlert.mutate,
    unreadCount,
  };
}

// Manual trigger for testing overspending checks
export async function triggerOverspendingCheck() {
  const { data, error } = await supabase.functions.invoke("check-overspending", {
    method: "POST",
  });

  if (error) throw error;
  return data;
}
