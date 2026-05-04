"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { VoteBreakdown } from "@/lib/votes";
import { formatVotePair } from "@/lib/votes";

type VoteButtonsProps = {
  endpoint: string;
  breakdown: VoteBreakdown;
  label: string;
};

export function VoteButtons({ endpoint, breakdown, label }: VoteButtonsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<"up" | "down" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function vote(value: 1 | -1) {
    setPending(value === 1 ? "up" : "down");
    setMessage(null);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setMessage(payload?.error?.message || "Vote was not saved.");
    } else {
      router.refresh();
    }

    setPending(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Upvote ${label}`}
          disabled={pending !== null}
          onClick={() => vote(1)}
        >
          <ArrowUp className="size-4" aria-hidden="true" />
          <span>{breakdown.total.up}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Downvote ${label}`}
          disabled={pending !== null}
          onClick={() => vote(-1)}
        >
          <ArrowDown className="size-4" aria-hidden="true" />
          <span>{breakdown.total.down}</span>
        </Button>
        <span className="text-xs font-bold text-muted-foreground">Score {breakdown.total.score}</span>
      </div>
      <dl className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center justify-between gap-2">
          <dt>Civic</dt>
          <dd className="font-bold">{formatVotePair(breakdown.civic.up, breakdown.civic.down)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt>Verified</dt>
          <dd className="font-bold">
            {formatVotePair(breakdown.institutional.up, breakdown.institutional.down)}
          </dd>
        </div>
      </dl>
      {message ? <p className="text-xs font-bold text-destructive">{message}</p> : null}
    </div>
  );
}
