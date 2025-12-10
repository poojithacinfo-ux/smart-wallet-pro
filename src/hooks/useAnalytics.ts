import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  budget: number;
  budgetUsedPercentage: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
}

export interface TrendData {
  date: string;
  income: number;
  expense: number;
}

export function useAnalyticsSummary(from?: string, to?: string) {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ["analytics-summary", user?.id, from, to],
    queryFn: async (): Promise<AnalyticsSummary> => {
      if (!user || !session) throw new Error("Not authenticated");

      // Build date filters
      let query = supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user.id);

      if (from) query = query.gte("date", from);
      if (to) query = query.lte("date", to);

      const { data: transactions, error } = await query;
      if (error) throw error;

      let totalIncome = 0;
      let totalExpense = 0;
      transactions?.forEach((t) => {
        if (t.type === "income") {
          totalIncome += Number(t.amount);
        } else {
          totalExpense += Number(t.amount);
        }
      });

      const balance = totalIncome - totalExpense;

      // Get current month's budget
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: budgetData } = await supabase
        .from("budgets")
        .select("limit_amount")
        .eq("user_id", user.id)
        .eq("period_value", currentMonth)
        .eq("period_type", "monthly")
        .maybeSingle();

      const budget = budgetData?.limit_amount ?? 0;
      const budgetUsedPercentage = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;

      return {
        totalIncome,
        totalExpense,
        balance,
        budget,
        budgetUsedPercentage,
      };
    },
    enabled: !!user && !!session,
  });
}

export function useCategorySpend(from?: string, to?: string) {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ["category-spend", user?.id, from, to],
    queryFn: async (): Promise<CategorySpend[]> => {
      if (!user || !session) throw new Error("Not authenticated");

      let query = supabase
        .from("transactions")
        .select("category, amount")
        .eq("user_id", user.id)
        .eq("type", "expense");

      if (from) query = query.gte("date", from);
      if (to) query = query.lte("date", to);

      const { data: transactions, error } = await query;
      if (error) throw error;

      const categorySpend: Record<string, number> = {};
      transactions?.forEach((t) => {
        categorySpend[t.category] = (categorySpend[t.category] || 0) + Number(t.amount);
      });

      return Object.entries(categorySpend)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);
    },
    enabled: !!user && !!session,
  });
}

export function useAnalyticsTrend(period: "monthly" | "weekly" = "monthly", from?: string, to?: string) {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ["analytics-trend", user?.id, period, from, to],
    queryFn: async (): Promise<TrendData[]> => {
      if (!user || !session) throw new Error("Not authenticated");

      let query = supabase
        .from("transactions")
        .select("date, amount, type")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (from) query = query.gte("date", from);
      if (to) query = query.lte("date", to);

      const { data: transactions, error } = await query;
      if (error) throw error;

      const trendData: Record<string, { income: number; expense: number }> = {};

      transactions?.forEach((t) => {
        const date = new Date(t.date);
        let key: string;

        if (period === "weekly") {
          const startOfYear = new Date(date.getFullYear(), 0, 1);
          const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
          const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${week.toString().padStart(2, "0")}`;
        } else {
          key = date.toISOString().slice(0, 7);
        }

        if (!trendData[key]) {
          trendData[key] = { income: 0, expense: 0 };
        }

        if (t.type === "income") {
          trendData[key].income += Number(t.amount);
        } else {
          trendData[key].expense += Number(t.amount);
        }
      });

      return Object.entries(trendData).map(([date, data]) => ({
        date,
        income: data.income,
        expense: data.expense,
      }));
    },
    enabled: !!user && !!session,
  });
}

export function useTopCategories(limit: number = 5, from?: string, to?: string) {
  const { data: categorySpend, isLoading } = useCategorySpend(from, to);

  const topCategories = useMemo(() => {
    return categorySpend?.slice(0, limit) || [];
  }, [categorySpend, limit]);

  return { topCategories, isLoading };
}
