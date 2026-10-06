import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  rawDate: string;
  balanceAfter: number;
}

export function useTransactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;

      let runningBalance = 0;
      const chronologicalTransactions = (data ?? []).map((t) => {
        const amount = Number(t.amount);
        runningBalance += t.type === "income" ? amount : -amount;

        return {
          id: t.id,
          description: t.note || t.category,
          amount,
          type: t.type as "income" | "expense",
          category: t.category,
          date: new Date(t.date).toLocaleDateString("en-IN", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          rawDate: t.date,
          balanceAfter: runningBalance,
        };
      });

      return chronologicalTransactions.reverse();
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (newTransaction: {
      description: string;
      amount: number;
      type: "income" | "expense";
      category: string;
      date: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount: newTransaction.amount,
        category: newTransaction.category,
        type: newTransaction.type,
        date: newTransaction.date,
        note: newTransaction.description,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Transaction added",
        description: "Your transaction has been saved successfully.",
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

  return {
    transactions,
    isLoading,
    addTransaction: addTransaction.mutate,
    isAdding: addTransaction.isPending,
  };
}
