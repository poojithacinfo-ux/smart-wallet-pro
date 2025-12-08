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
        .order("date", { ascending: false });

      if (error) throw error;

      return data.map((t) => ({
        id: t.id,
        description: t.note || t.category,
        amount: Number(t.amount),
        type: t.type as "income" | "expense",
        category: t.category,
        date: new Date(t.date).toLocaleDateString("en-IN", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      }));
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
