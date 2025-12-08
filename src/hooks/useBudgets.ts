import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBudgets() {
  const { user } = useAuth();

  const { data: budget, isLoading } = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .maybeSingle();

      if (error) throw error;

      return data ? Number(data.amount) : null;
    },
    enabled: !!user,
  });

  return { budget, isLoading };
}
