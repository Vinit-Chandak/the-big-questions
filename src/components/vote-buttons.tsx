"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { VoteBreakdown } from "@/lib/votes";
import { formatVotePair } from "@/lib/votes";
import { cn } from "@/lib/utils";

type VoteButtonsProps = {
  endpoint: string;
  breakdown: VoteBreakdown;
  label: string;
};

function supportShare(up: number, down: number): number | null {
  const total = up + down;
  if (total === 0) return null;
  return up / total;
}

function GroupSignal({
  name,
  up,
  down,
  barClass
}: {
  name: string;
  up: number;
  down: number;
  barClass: string;
}) {
  const share = supportShare(up, down);
  return (
    <div className="flex items-center gap-2">
      <span className="type-meta w-[4.6rem] shrink-0 text-muted-foreground">{name}</span>
      <span
        className="h-1.5 min-w-8 flex-1 overflow-hidden rounded-full bg-border/70"
        role="img"
        aria-label={
          share === null
            ? `No ${name.toLowerCase()} votes yet`
            : `${name} support: ${Math.round(share * 100)} percent of ${up + down} votes`
        }
      >
        {share !== null ? (
          <span className={cn("block h-full rounded-full", barClass)} style={{ width: `${Math.round(share * 100)}%` }} />
        ) : null}
      </span>
      <span className="type-meta w-14 shrink-0 text-right font-semibold tabular-nums text-foreground/85">
        {formatVotePair(up, down)}
      </span>
    </div>
  );
}

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

  const civicShare = supportShare(breakdown.civic.up, breakdown.civic.down);
  const institutionalShare = supportShare(breakdown.institutional.up, breakdown.institutional.down);
  const diverges =
    civicShare !== null && institutionalShare !== null && Math.abs(civicShare - institutionalShare) >= 0.4;

  return (
    <div className="w-full max-w-xs shrink-0 lg:w-64">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Upvote ${label}`}
          disabled={pending !== null}
          onClick={() => vote(1)}
        >
          <ArrowUp className="size-4" aria-hidden="true" />
          <span className="tabular-nums">{breakdown.total.up}</span>
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
          <span className="tabular-nums">{breakdown.total.down}</span>
        </Button>
        <span className="type-meta font-semibold tabular-nums text-muted-foreground">
          Net {breakdown.total.score > 0 ? `+${breakdown.total.score}` : breakdown.total.score}
        </span>
      </div>

      <div className="mt-3 grid gap-1.5">
        <GroupSignal name="Civic" up={breakdown.civic.up} down={breakdown.civic.down} barClass="bg-civic" />
        <GroupSignal
          name="Verified"
          up={breakdown.institutional.up}
          down={breakdown.institutional.down}
          barClass="bg-institutional"
        />
      </div>

      {diverges ? (
        <p className="type-meta mt-2 flex items-center gap-1.5 text-muted-foreground">
          <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />
          Civic and institutional readings diverge.
        </p>
      ) : null}

      {message ? (
        <p className="type-meta mt-2 font-semibold text-destructive" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
