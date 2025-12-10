-- Add new alert types to enum
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'overspending_daily';
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'overspending_monthly';

-- Add period_type enum
DO $$ BEGIN
  CREATE TYPE period_type AS ENUM ('monthly', 'daily');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Modify budgets table - add period_type column
ALTER TABLE public.budgets 
ADD COLUMN IF NOT EXISTS period_type period_type NOT NULL DEFAULT 'monthly';

-- Rename amount to limit_amount for clarity (if not already renamed)
DO $$ BEGIN
  ALTER TABLE public.budgets RENAME COLUMN amount TO limit_amount;
EXCEPTION
  WHEN undefined_column THEN null;
END $$;

-- Rename month to period_value for unified naming
DO $$ BEGIN
  ALTER TABLE public.budgets RENAME COLUMN month TO period_value;
EXCEPTION
  WHEN undefined_column THEN null;
END $$;

-- Add new columns to alerts table
ALTER TABLE public.alerts 
ADD COLUMN IF NOT EXISTS period_value text,
ADD COLUMN IF NOT EXISTS amount_limit numeric,
ADD COLUMN IF NOT EXISTS current_spent numeric,
ADD COLUMN IF NOT EXISTS percent_used numeric,
ADD COLUMN IF NOT EXISTS is_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS send_status text;

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_budgets_user_period ON public.budgets(user_id, period_type, period_value);
CREATE INDEX IF NOT EXISTS idx_alerts_user_type_period ON public.alerts(user_id, type, period_value);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type_date ON public.transactions(user_id, type, date);

-- Update unique constraint on budgets
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS budgets_user_id_month_key;
ALTER TABLE public.budgets ADD CONSTRAINT budgets_user_period_unique UNIQUE (user_id, period_type, period_value);