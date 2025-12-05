import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  TransactionTable,
  Transaction,
} from "@/components/transactions/TransactionTable";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { Button } from "@/components/ui/button";

const initialTransactions: Transaction[] = [
  {
    id: "txn-001",
    description: "Grocery Shopping",
    amount: 156.32,
    type: "expense",
    category: "Food & Dining",
    date: "Dec 04, 2024",
  },
  {
    id: "txn-002",
    description: "Monthly Salary",
    amount: 5200,
    type: "income",
    category: "Salary",
    date: "Dec 01, 2024",
  },
  {
    id: "txn-003",
    description: "Netflix Subscription",
    amount: 15.99,
    type: "expense",
    category: "Entertainment",
    date: "Dec 01, 2024",
  },
  {
    id: "txn-004",
    description: "Gas Station",
    amount: 48.5,
    type: "expense",
    category: "Transportation",
    date: "Nov 30, 2024",
  },
  {
    id: "txn-005",
    description: "Freelance Project",
    amount: 850,
    type: "income",
    category: "Freelance",
    date: "Nov 28, 2024",
  },
  {
    id: "txn-006",
    description: "Electric Bill",
    amount: 125.0,
    type: "expense",
    category: "Bills",
    date: "Nov 25, 2024",
  },
  {
    id: "txn-007",
    description: "Online Shopping",
    amount: 234.99,
    type: "expense",
    category: "Shopping",
    date: "Nov 23, 2024",
  },
  {
    id: "txn-008",
    description: "Restaurant Dinner",
    amount: 78.5,
    type: "expense",
    category: "Food & Dining",
    date: "Nov 22, 2024",
  },
];

export default function Transactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">(
    "all"
  );
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
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      ...newTransaction,
      date: new Date(newTransaction.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
    setTransactions([transaction, ...transactions]);
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
              {transactions.length}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center justify-between neon-glow-success">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="font-display text-2xl font-bold text-success">
              +${totalIncome.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center justify-between neon-glow-destructive">
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="font-display text-2xl font-bold text-destructive">
              -${totalExpenses.toLocaleString()}
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
        <TransactionTable transactions={filteredTransactions} />
      </motion.div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddTransaction}
      />
    </DashboardLayout>
  );
}
