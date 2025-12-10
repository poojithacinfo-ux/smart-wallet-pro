import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Limit {
  id: string;
  user_id: string;
  period_type: "monthly" | "daily";
  period_value: string;
  limit_amount: number;
  created_at: string;
}

export function useLimits(periodType?: "monthly" | "daily") {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: limits = [], isLoading } = useQuery({
    queryKey: ["limits", user?.id, periodType],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase.functions.invoke("limits", {
        method: "GET",
        body: null,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (error) throw error;
      
      let allLimits = data?.limits || [];
      if (periodType) {
        allLimits = allLimits.filter((l: Limit) => l.period_type === periodType);
      }
      return allLimits as Limit[];
    },
    enabled: !!user,
  });

  const setLimit = useMutation({
    mutationFn: async ({
      period_type,
      period_value,
      limit_amount,
    }: {
      period_type: "monthly" | "daily";
      period_value: string;
      limit_amount: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("limits", {
        method: "POST",
        body: { period_type, period_value, limit_amount },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limits"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast({
        title: "Limit saved",
        description: "Your budget limit has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteLimit = useMutation({
    mutationFn: async (limitId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("limits", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: { id: limitId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limits"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast({
        title: "Limit deleted",
        description: "Your budget limit has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get current month's limit
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentDay = new Date().toISOString().slice(0, 10);
  
  const monthlyLimit = limits.find(
    (l) => l.period_type === "monthly" && l.period_value === currentMonth
  );
  const dailyLimit = limits.find(
    (l) => l.period_type === "daily" && l.period_value === currentDay
  );

  return {
    limits,
    isLoading,
    setLimit: setLimit.mutate,
    deleteLimit: deleteLimit.mutate,
    isSettingLimit: setLimit.isPending,
    monthlyLimit,
    dailyLimit,
  };
}

// Manual trigger for testing
export async function runOverspendingChecks(testUserId?: string) {
  const params = new URLSearchParams();
  if (testUserId) {
    params.set("mode", "test");
    params.set("user_id", testUserId);
  }

  const { data, error } = await supabase.functions.invoke("check-overspending", {
    method: "POST",
    body: null,
  });

  if (error) throw error;
  return data;
}
