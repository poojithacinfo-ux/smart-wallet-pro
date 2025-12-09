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
    const period = url.searchParams.get("period") || "monthly";
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    console.log(`Fetching trend for user ${user.id}, period: ${period}, from: ${from}, to: ${to}`);

    let query = supabase
      .from("transactions")
      .select("date, amount, type")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);

    const { data: transactions, error: txError } = await query;
    if (txError) throw txError;

    // Aggregate by period
    const trendData: Record<string, { income: number; expense: number }> = {};

    transactions?.forEach((t) => {
      const date = new Date(t.date);
      let key: string;

      if (period === "weekly") {
        // Get ISO week number
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        key = `${date.getFullYear()}-W${week.toString().padStart(2, "0")}`;
      } else {
        // Monthly
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

    // Convert to array format
    const result = Object.entries(trendData).map(([date, data]) => ({
      date,
      income: data.income,
      expense: data.expense,
    }));

    console.log("Trend result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in analytics-trend:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
