import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex max-w-full items-center rounded-md border px-2 py-1 text-xs font-bold leading-tight",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/10 text-primary",
        secondary: "border-secondary bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-foreground",
        amber: "border-accent bg-accent/35 text-accent-foreground",
        muted: "border-border bg-muted text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
