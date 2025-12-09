import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    console.log(`Fetching analytics summary for user ${user.id}, from: ${from}, to: ${to}`);

    // Build date filters
    let transactionQuery = supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", user.id);

    if (from) transactionQuery = transactionQuery.gte("date", from);
    if (to) transactionQuery = transactionQuery.lte("date", to);

    const { data: transactions, error: txError } = await transactionQuery;
    if (txError) throw txError;

    // Calculate totals
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
      .select("amount")
      .eq("user_id", user.id)
      .eq("month", currentMonth)
      .maybeSingle();

    const budget = budgetData?.amount ?? 0;
    const budgetUsedPercentage = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;

    const result = {
      totalIncome,
      totalExpense,
      balance,
      budget,
      budgetUsedPercentage,
    };

    console.log("Analytics summary result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in analytics-summary:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
