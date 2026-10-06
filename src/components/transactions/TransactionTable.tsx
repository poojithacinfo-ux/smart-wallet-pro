import { motion } from "framer-motion";
import {
  Utensils,
  Car,
  Film,
  ShoppingBag,
  Zap,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  balanceAfter: number;
}

const categoryIcons: Record<string, any> = {
  "Food & Dining": Utensils,
  Transportation: Car,
  Entertainment: Film,
  Shopping: ShoppingBag,
  Bills: Zap,
  Salary: ArrowDownLeft,
  Freelance: ArrowDownLeft,
};

const categoryColors: Record<string, string> = {
  "Food & Dining": "text-primary bg-primary/10",
  Transportation: "text-accent bg-accent/10",
  Entertainment: "text-secondary bg-secondary/10",
  Shopping: "text-warning bg-warning/10",
  Bills: "text-destructive bg-destructive/10",
  Salary: "text-success bg-success/10",
  Freelance: "text-success bg-success/10",
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Balance after
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {transactions.map((transaction, index) => {
              const Icon =
                categoryIcons[transaction.category] || ShoppingBag;
              const colorClass =
                categoryColors[transaction.category] || "text-muted bg-muted/10";

              return (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                          colorClass
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          #{transaction.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium",
                        colorClass
                      )}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {transaction.type === "income" ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      )}
                      <span
                        className={cn(
                          "font-display font-semibold",
                          transaction.type === "income"
                            ? "text-success"
                            : "text-foreground"
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 text-right font-display font-semibold whitespace-nowrap",
                      transaction.balanceAfter < 0 ? "text-destructive" : "text-success"
                    )}
                  >
                    ₹{transaction.balanceAfter.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
