import * as React from "react";
import { cn } from "@/lib/utils";
import type { FollowUpStatus } from "@/lib/types";

const tones: Record<FollowUpStatus, string> = {
  open: "border-gold/70 bg-accent/35 text-accent-foreground",
  answered: "border-civic/50 bg-civic/8 text-civic",
  declined: "border-institutional/50 bg-institutional/8 text-institutional",
  closed: "border-border bg-muted text-muted-foreground"
};

/** Rubber-stamp style status marker for follow-up requests. */
export function StatusStamp({ status, className }: { status: FollowUpStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border-[1.5px] px-2 py-0.5 text-[0.66rem] font-bold uppercase leading-snug tracking-[0.16em]",
        tones[status],
        className
      )}
    >
      {status}
    </span>
  );
}
