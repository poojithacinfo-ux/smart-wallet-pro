import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface DateRangeFilterProps {
  onChange: (range: { from?: string; to?: string }) => void;
}

type QuickRange = "all" | "thisMonth" | "lastMonth" | "last3Months" | "last6Months" | "custom";

export function DateRangeFilter({ onChange }: DateRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState<QuickRange>("all");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const handleQuickRange = (range: QuickRange) => {
    setSelectedRange(range);
    const now = new Date();

    switch (range) {
      case "all":
        onChange({});
        break;
      case "thisMonth":
        onChange({
          from: format(startOfMonth(now), "yyyy-MM-dd"),
          to: format(endOfMonth(now), "yyyy-MM-dd"),
        });
        break;
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        onChange({
          from: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
          to: format(endOfMonth(lastMonth), "yyyy-MM-dd"),
        });
        break;
      case "last3Months":
        onChange({
          from: format(subMonths(now, 3), "yyyy-MM-dd"),
          to: format(now, "yyyy-MM-dd"),
        });
        break;
      case "last6Months":
        onChange({
          from: format(subMonths(now, 6), "yyyy-MM-dd"),
          to: format(now, "yyyy-MM-dd"),
        });
        break;
      case "custom":
        // Don't change until dates are selected
        break;
    }
  };

  const handleCustomDateChange = () => {
    if (customFrom && customTo) {
      onChange({
        from: format(customFrom, "yyyy-MM-dd"),
        to: format(customTo, "yyyy-MM-dd"),
      });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex bg-muted/50 rounded-lg p-1">
        {[
          { value: "all" as QuickRange, label: "All" },
          { value: "thisMonth" as QuickRange, label: "This Month" },
          { value: "lastMonth" as QuickRange, label: "Last Month" },
          { value: "last3Months" as QuickRange, label: "3M" },
          { value: "last6Months" as QuickRange, label: "6M" },
        ].map((option) => (
          <Button
            key={option.value}
            variant={selectedRange === option.value ? "default" : "ghost"}
            size="sm"
            onClick={() => handleQuickRange(option.value)}
            className="text-xs px-2 py-1 h-7"
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={selectedRange === "custom" ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Custom
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">From</p>
                <Calendar
                  mode="single"
                  selected={customFrom}
                  onSelect={(date) => {
                    setCustomFrom(date);
                    setSelectedRange("custom");
                  }}
                  disabled={(date) => date > new Date()}
                  className="rounded-md border"
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">To</p>
                <Calendar
                  mode="single"
                  selected={customTo}
                  onSelect={(date) => {
                    setCustomTo(date);
                    setSelectedRange("custom");
                  }}
                  disabled={(date) => date > new Date() || (customFrom ? date < customFrom : false)}
                  className="rounded-md border"
                />
              </div>
            </div>
            <Button
              onClick={handleCustomDateChange}
              disabled={!customFrom || !customTo}
              className="w-full"
            >
              Apply Range
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
