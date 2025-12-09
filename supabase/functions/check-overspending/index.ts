import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface UserBudgetCheck {
  userId: string;
  email: string;
  name: string;
  budget: number;
  totalExpense: number;
  percentageUsed: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting overspending check...");

    // Use service role key for scheduled jobs
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthStart = `${currentMonth}-01`;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const monthEnd = `${nextMonth.toISOString().slice(0, 7)}-01`;

    console.log(`Checking budgets for month: ${currentMonth}`);

    // Get all users with budgets set for current month
    const { data: budgets, error: budgetError } = await supabase
      .from("budgets")
      .select("user_id, amount")
      .eq("month", currentMonth)
      .gt("amount", 0);

    if (budgetError) throw budgetError;

    console.log(`Found ${budgets?.length || 0} users with budgets`);

    const usersToAlert: UserBudgetCheck[] = [];

    for (const budget of budgets || []) {
      // Get user's total expenses for current month
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", budget.user_id)
        .eq("type", "expense")
        .gte("date", monthStart)
        .lt("date", monthEnd);

      if (txError) {
        console.error(`Error fetching transactions for user ${budget.user_id}:`, txError);
        continue;
      }

      const totalExpense = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const percentageUsed = (totalExpense / budget.amount) * 100;

      console.log(`User ${budget.user_id}: Budget ₹${budget.amount}, Spent ₹${totalExpense} (${percentageUsed.toFixed(1)}%)`);

      if (percentageUsed >= 80) {
        // Check if alert already exists for this month
        const { data: existingAlert } = await supabase
          .from("alerts")
          .select("id")
          .eq("user_id", budget.user_id)
          .eq("type", "overspending")
          .gte("created_at", monthStart)
          .lt("created_at", monthEnd)
          .maybeSingle();

        if (!existingAlert) {
          // Get user profile for email
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, name")
            .eq("user_id", budget.user_id)
            .maybeSingle();

          if (profile) {
            usersToAlert.push({
              userId: budget.user_id,
              email: profile.email,
              name: profile.name,
              budget: budget.amount,
              totalExpense,
              percentageUsed,
            });
          }
        } else {
          console.log(`Alert already exists for user ${budget.user_id} this month`);
        }
      }
    }

    console.log(`${usersToAlert.length} users need overspending alerts`);

    const results = [];

    for (const user of usersToAlert) {
      try {
        // Create alert in database
        const alertMessage = `You've used ${user.percentageUsed.toFixed(0)}% of your monthly budget (₹${user.totalExpense.toLocaleString("en-IN")} of ₹${user.budget.toLocaleString("en-IN")}). Consider reducing discretionary spending.`;

        const { data: alert, error: alertError } = await supabase
          .from("alerts")
          .insert({
            user_id: user.userId,
            type: "overspending",
            message: alertMessage,
            is_read: false,
          })
          .select()
          .single();

        if (alertError) throw alertError;

        console.log(`Created alert for user ${user.userId}`);

        // Send email
        const emailResult = await resend.emails.send({
          from: "Finance Tracker <onboarding@resend.dev>",
          to: [user.email],
          subject: "⚠️ Alert: Approaching Budget Limit",
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #0A0F1F 0%, #1a1f3c 100%); padding: 30px; border-radius: 16px; color: white;">
                <h1 style="margin: 0 0 20px; font-size: 24px;">Budget Alert</h1>
                <p style="margin: 0 0 16px; font-size: 16px;">Hi ${user.name},</p>
                <p style="margin: 0 0 16px; font-size: 16px;">
                  You've used <strong style="color: #FF6B6B;">${user.percentageUsed.toFixed(0)}%</strong> of your monthly budget.
                </p>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; margin: 20px 0;">
                  <p style="margin: 0 0 8px; font-size: 14px; color: #B0B0B0;">Budget Amount</p>
                  <p style="margin: 0 0 16px; font-size: 24px; font-weight: bold;">₹${user.budget.toLocaleString("en-IN")}</p>
                  <p style="margin: 0 0 8px; font-size: 14px; color: #B0B0B0;">Total Spent</p>
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #FF6B6B;">₹${user.totalExpense.toLocaleString("en-IN")}</p>
                </div>
                <div style="background: rgba(255, 107, 107, 0.2); padding: 16px; border-radius: 8px; border-left: 4px solid #FF6B6B;">
                  <p style="margin: 0; font-size: 14px;">
                    <strong>💡 Tip:</strong> Review your recent transactions and consider reducing discretionary spending like dining out or entertainment to stay within budget.
                  </p>
                </div>
              </div>
              <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
                This is an automated alert from your Finance Tracker.
              </p>
            </div>
          `,
        });

        console.log(`Email sent to ${user.email}:`, emailResult);

        results.push({
          userId: user.userId,
          alertId: alert.id,
          emailSent: true,
          percentageUsed: user.percentageUsed,
        });
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(`Error processing user ${user.userId}:`, err);
        results.push({
          userId: user.userId,
          error: errMessage,
          emailSent: false,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: budgets?.length || 0,
        alertsSent: results.filter((r) => r.emailSent).length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error in check-overspending:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
