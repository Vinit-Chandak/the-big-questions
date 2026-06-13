import * as React from "react";
import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-[0.78rem] font-semibold uppercase leading-none tracking-[0.08em] text-foreground/80", className)}
      {...props}
    />
  );
}
