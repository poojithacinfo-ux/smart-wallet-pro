import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { TopCategoriesChart } from "@/components/analytics/TopCategoriesChart";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["analytics-summary"] });
    await queryClient.invalidateQueries({ queryKey: ["category-spend"] });
    await queryClient.invalidateQueries({ queryKey: ["analytics-trend"] });
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    toast({ title: "Data refreshed", description: "All charts have been updated." });
    setIsRefreshing(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Deep dive into your financial patterns and insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter onChange={setDateRange} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <AnalyticsSummaryCards from={dateRange.from} to={dateRange.to} />

      {/* Top Categories Bar Chart */}
      <TopCategoriesChart from={dateRange.from} to={dateRange.to} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingChart from={dateRange.from} to={dateRange.to} />
        <TrendChart from={dateRange.from} to={dateRange.to} />
      </div>

      {/* Budget Progress */}
      <BudgetProgress />
    </DashboardLayout>
  );
}
