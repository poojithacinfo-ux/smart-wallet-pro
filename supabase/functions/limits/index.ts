import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);

    if (req.method === "GET") {
      // GET /api/limits?period_type=monthly|daily&period_value=<value>
      const periodType = url.searchParams.get("period_type") || "monthly";
      const periodValue = url.searchParams.get("period_value");

      let query = supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_type", periodType);

      if (periodValue) {
        query = query.eq("period_value", periodValue);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching limits:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ limits: data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      // POST /api/limits - set or update a limit
      const body = await req.json();
      const { period_type, period_value, limit_amount } = body;

      if (!period_type || !period_value || limit_amount === undefined) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: period_type, period_value, limit_amount" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate period_type
      if (!["monthly", "daily"].includes(period_type)) {
        return new Response(
          JSON.stringify({ error: "period_type must be 'monthly' or 'daily'" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if limit already exists
      const { data: existing } = await supabase
        .from("budgets")
        .select("id")
        .eq("user_id", user.id)
        .eq("period_type", period_type)
        .eq("period_value", period_value)
        .maybeSingle();

      let result;
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("budgets")
          .update({ limit_amount })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        console.log(`Updated limit for user ${user.id}: ${period_type} ${period_value} = ${limit_amount}`);
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("budgets")
          .insert({
            user_id: user.id,
            period_type,
            period_value,
            limit_amount,
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
        console.log(`Created limit for user ${user.id}: ${period_type} ${period_value} = ${limit_amount}`);
      }

      return new Response(
        JSON.stringify({ limit: result }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "DELETE") {
      // DELETE /api/limits?id=<limit_id>
      const limitId = url.searchParams.get("id");
      if (!limitId) {
        return new Response(
          JSON.stringify({ error: "Missing limit id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", limitId)
        .eq("user_id", user.id);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in limits function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
