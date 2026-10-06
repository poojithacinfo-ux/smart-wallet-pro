import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Calendar, TrendingUp, AlertTriangle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLimits, runOverspendingChecks } from "@/hooks/useLimits";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function LimitsSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { limits, isLoading, setLimit, deleteLimit, isSettingLimit, isDeletingLimit } = useLimits();
  
  const [periodType, setPeriodType] = useState<"monthly" | "daily">("monthly");
  const [periodValue, setPeriodValue] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7); // YYYY-MM
  });
  const [limitAmount, setLimitAmount] = useState("");
  const [isRunningChecks, setIsRunningChecks] = useState(false);

  const handlePeriodTypeChange = (value: "monthly" | "daily") => {
    setPeriodType(value);
    const now = new Date();
    if (value === "monthly") {
      setPeriodValue(now.toISOString().slice(0, 7));
    } else {
      setPeriodValue(now.toISOString().slice(0, 10));
    }
  };

  const handleSubmit = () => {
    const amount = parseFloat(limitAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid limit amount.",
        variant: "destructive",
      });
      return;
    }

    setLimit({
      period_type: periodType,
      period_value: periodValue,
      limit_amount: amount,
    });
    setLimitAmount("");
  };

  const handleRunChecks = async () => {
    setIsRunningChecks(true);
    try {
      const result = await runOverspendingChecks(user?.id);
      toast({
        title: "Checks completed",
        description: `Checked ${result.budgetsChecked} budgets. ${result.alertsCreated} alerts created, ${result.emailsSent} emails sent.`,
      });
    } catch (error: any) {
      toast({
        title: "Check failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRunningChecks(false);
    }
  };

  const formatPeriodDisplay = (type: string, value: string) => {
    if (type === "monthly") {
      const date = new Date(value + "-01");
      return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    }
    return new Date(value).toLocaleDateString("en-IN", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  return (
    <div className="space-y-6">
      {/* Add New Limit */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Set Budget Limit
          </CardTitle>
          <CardDescription>
            Set spending limits to receive alerts when you approach your budget threshold (80%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Period Type</Label>
              <Select value={periodType} onValueChange={handlePeriodTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Period</Label>
              <Input
                type={periodType === "monthly" ? "month" : "date"}
                value={periodValue}
                onChange={(e) => setPeriodValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Limit Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSettingLimit || !limitAmount}
            className="w-full md:w-auto"
          >
            {isSettingLimit ? "Saving..." : "Save Limit"}
          </Button>
        </CardContent>
      </Card>

      {/* Current Limits */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Budget Limits
          </CardTitle>
          <CardDescription>
            Manage your monthly and daily spending limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading limits...</p>
          ) : limits.length === 0 ? (
            <p className="text-muted-foreground">No limits set yet. Add your first budget limit above.</p>
          ) : (
            <div className="space-y-3">
              {limits.map((limit) => (
                <motion.div
                  key={limit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      limit.period_type === "monthly" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-accent/20 text-accent-foreground"
                    }`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatPeriodDisplay(limit.period_type, limit.period_value)}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {limit.period_type} limit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-primary">
                      ₹{Number(limit.limit_amount).toLocaleString("en-IN")}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteLimit(limit.id)}
                      disabled={isDeletingLimit}
                      aria-label={`Delete ${limit.period_type} limit for ${formatPeriodDisplay(limit.period_type, limit.period_value)}`}
                      title="Delete limit"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Overspending Checks */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Test Alert System
          </CardTitle>
          <CardDescription>
            Manually trigger overspending checks to test the alert system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleRunChecks}
            disabled={isRunningChecks}
            variant="outline"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunningChecks ? "Running Checks..." : "Run Overspending Checks"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will check all your budget limits and send alerts/emails if thresholds are exceeded.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
