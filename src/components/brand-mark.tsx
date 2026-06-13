import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The hearing mark: an amphitheater of concentric tiers around a single
 * speaker, set on a broadsheet rule. Strokes inherit currentColor so the
 * mark prints correctly on light and dark paper.
 */
export function BrandMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      <path d="M8 42a24 24 0 0 1 48 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M15.5 42a16.5 16.5 0 0 1 33 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M23 42a9 9 0 0 1 18 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="42" r="3.25" fill="var(--gold)" />
      <path d="M7 50h50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 56h44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
