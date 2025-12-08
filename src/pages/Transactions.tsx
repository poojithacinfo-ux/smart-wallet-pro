import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";

export default function Transactions() {
  const { transactions, isLoading, addTransaction, isAdding } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">("all");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || t.type === selectedType;
      const matchesCategory =
        !selectedCategory || t.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchQuery, selectedType, selectedCategory]);

  const handleAddTransaction = (newTransaction: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  }) => {
    addTransaction(newTransaction);
    setDialogOpen(false);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Transactions
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all your financial activities.
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={() => setDialogOpen(true)}>
            <Plus className="h-5 w-5" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : transactions.length}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center justify-between neon-glow-success">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="font-display text-2xl font-bold text-success">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `+₹${totalIncome.toLocaleString("en-IN")}`}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center justify-between neon-glow-destructive">
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="font-display text-2xl font-bold text-destructive">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `-₹${totalExpenses.toLocaleString("en-IN")}`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started!</p>
          </div>
        ) : (
          <TransactionTable transactions={filteredTransactions} />
        )}
      </motion.div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddTransaction}
        isLoading={isAdding}
      />
    </DashboardLayout>
  );
}
