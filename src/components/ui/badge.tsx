import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex max-w-full items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.1em]",
  {
    variants: {
      variant: {
        default: "border-primary/35 bg-primary/8 text-primary",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
        amber: "border-gold/50 bg-accent/40 text-accent-foreground",
        muted: "border-border bg-muted text-muted-foreground",
        civic: "border-civic/40 bg-civic/8 text-civic",
        institutional: "border-institutional/40 bg-institutional/8 text-institutional"
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
