import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Food & Dining", value: 1200, color: "hsl(208 100% 61%)" },
  { name: "Transportation", value: 800, color: "hsl(270 100% 71%)" },
  { name: "Entertainment", value: 500, color: "hsl(208 100% 89%)" },
  { name: "Shopping", value: 900, color: "hsl(142 76% 46%)" },
  { name: "Bills & Utilities", value: 1500, color: "hsl(38 92% 50%)" },
  { name: "Others", value: 400, color: "hsl(224 30% 50%)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-primary/20">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-lg font-display font-bold text-primary">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function SpendingChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Spending by Category
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
