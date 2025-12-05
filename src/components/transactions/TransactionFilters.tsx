import { motion } from "framer-motion";
import { Search, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: "all" | "income" | "expense";
  onTypeChange: (type: "all" | "income" | "expense") => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  "All",
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Salary",
  "Freelance",
];

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
}: TransactionFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 p-1 rounded-xl bg-muted">
          {(["all", "income", "expense"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize",
                selectedType === type
                  ? type === "income"
                    ? "bg-success/20 text-success"
                    : type === "expense"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-glass pb-2 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat === "All" ? "" : cat)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 border",
                (cat === "All" && !selectedCategory) || selectedCategory === cat
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
