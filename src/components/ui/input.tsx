import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl bg-card/80 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground transition-all duration-300 border border-border backdrop-blur-md",
          "focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(208_100%_61%/0.1),0_0_20px_hsl(208_100%_61%/0.2)] focus:outline-none",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
