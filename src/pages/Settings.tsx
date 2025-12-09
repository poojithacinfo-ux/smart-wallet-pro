import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Save,
  Wallet,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBudgets } from "@/hooks/useBudgets";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [budgetAmount, setBudgetAmount] = useState("");
  const { budget, setBudget, isSettingBudget } = useBudgets();
  const { toast } = useToast();

  const handleSaveBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid budget amount.",
        variant: "destructive",
      });
      return;
    }
    setBudget(amount);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "budget", label: "Budget", icon: Wallet },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and settings.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 h-fit"
        >
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary/20 to-accent/20 text-foreground shadow-neon-blue"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 glass-card p-6"
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Profile Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your personal details and preferences.
                </p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neon-blue">
                  <span className="font-display text-2xl font-bold text-foreground">
                    AD
                  </span>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    First Name
                  </label>
                  <Input type="text" defaultValue="Alex" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Last Name
                  </label>
                  <Input type="text" defaultValue="Demo" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <Input type="email" defaultValue="alex@neofinance.pro" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <Input type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>

              <Button variant="hero">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}

          {activeTab === "budget" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Monthly Budget
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Set your monthly spending budget to track your expenses.
                </p>
              </div>

              <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">Current Monthly Budget</p>
                <p className="font-display text-3xl font-bold gradient-text mt-1">
                  {budget ? `₹${budget.toLocaleString("en-IN")}` : "Not set"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Set New Budget Amount
                </label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    placeholder="Enter amount in ₹"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="hero"
                    onClick={handleSaveBudget}
                    disabled={isSettingBudget}
                  >
                    <Save className="h-4 w-4" />
                    {isSettingBudget ? "Saving..." : "Save Budget"}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-display font-semibold text-foreground mb-3">
                  Budget Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Set a realistic budget based on your average monthly expenses
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    You'll receive alerts when you reach 80% of your budget
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Review and adjust your budget monthly for better tracking
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Notification Preferences
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose how and when you want to be notified.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Overspending Alerts",
                    description: "Get notified when you exceed 80% of your budget",
                    enabled: true,
                  },
                  {
                    title: "Bill Reminders",
                    description: "Receive reminders for upcoming bill payments",
                    enabled: true,
                  },
                  {
                    title: "Low Balance Alerts",
                    description: "Alert when account balance falls below threshold",
                    enabled: true,
                  },
                  {
                    title: "Weekly Summary",
                    description: "Receive weekly spending summary emails",
                    enabled: false,
                  },
                  {
                    title: "Push Notifications",
                    description: "Enable browser push notifications",
                    enabled: false,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <button
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors duration-300",
                        item.enabled ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-all duration-300",
                          item.enabled ? "left-7" : "left-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Security Settings
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep your account secure with these settings.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Current Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    New Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Confirm New Password
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>

              <Button variant="hero">
                <Lock className="h-4 w-4" />
                Update Password
              </Button>

              <div className="pt-6 border-t border-border">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                  <div>
                    <p className="font-medium text-foreground">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Billing & Subscription
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your subscription and payment methods.
                </p>
              </div>

              <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 neon-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <p className="font-display text-2xl font-bold gradient-text">
                      Pro Plan
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ₹799/month • Renews Dec 15, 2024
                    </p>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Payment Method
                </h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        •••• •••• •••• 4242
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
