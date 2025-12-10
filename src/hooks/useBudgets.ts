import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useBudgets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const { data: budget, isLoading } = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_value", currentMonth)
        .eq("period_type", "monthly")
        .maybeSingle();

      if (error) throw error;

      return data ? Number(data.limit_amount) : null;
    },
    enabled: !!user,
  });

  const setBudget = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error("Not authenticated");

      // Try to upsert the budget for current month
      const { data: existing } = await supabase
        .from("budgets")
        .select("id")
        .eq("user_id", user.id)
        .eq("period_value", currentMonth)
        .eq("period_type", "monthly")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("budgets")
          .update({ limit_amount: amount })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("budgets")
          .insert({ 
            user_id: user.id, 
            period_value: currentMonth, 
            period_type: "monthly" as const,
            limit_amount: amount 
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["limits"] });
      toast({
        title: "Budget updated",
        description: "Your monthly budget has been saved.",
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

  return { budget, isLoading, setBudget: setBudget.mutate, isSettingBudget: setBudget.isPending };
}
