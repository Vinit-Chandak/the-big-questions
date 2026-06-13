import * as React from "react";
import { cn } from "@/lib/utils";

/** Small-caps section label with a gold lozenge — replaces badge noise. */
export function Kicker({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("type-kicker inline-flex items-center gap-2 text-muted-foreground", className)} {...props}>
      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />
      {children}
    </span>
  );
}
