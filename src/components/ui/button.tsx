import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-neon-blue hover:shadow-[0_0_30px_hsl(208_100%_61%/0.5)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-neon-destructive hover:shadow-[0_0_30px_hsl(0_84%_60%/0.5)] hover:-translate-y-0.5",
        success:
          "bg-success text-success-foreground shadow-neon-success hover:shadow-[0_0_30px_hsl(142_76%_46%/0.5)] hover:-translate-y-0.5",
        outline:
          "border border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        glass:
          "relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 text-foreground border border-primary/30 backdrop-blur-md hover:from-primary/30 hover:to-accent/30 hover:border-primary/50 hover:shadow-neon-blue hover:-translate-y-0.5",
        hero:
          "relative overflow-hidden bg-gradient-to-r from-primary to-accent text-foreground font-semibold shadow-neon-blue hover:shadow-[0_0_40px_hsl(208_100%_61%/0.6)] hover:-translate-y-1",
        neon:
          "relative bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-neon-blue",
        "neon-purple":
          "relative bg-transparent border-2 border-accent text-accent hover:bg-accent/10 hover:shadow-neon-purple",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
