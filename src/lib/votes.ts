import { authorGroup } from "@/lib/roles";
import type { VoteWithProfile } from "@/lib/types";

export type VoteBreakdown = {
  civic: {
    up: number;
    down: number;
  };
  institutional: {
    up: number;
    down: number;
  };
  total: {
    up: number;
    down: number;
    score: number;
  };
};

export const emptyVoteBreakdown: VoteBreakdown = {
  civic: { up: 0, down: 0 },
  institutional: { up: 0, down: 0 },
  total: { up: 0, down: 0, score: 0 }
};

function normalizeProfile(vote: VoteWithProfile) {
  if (Array.isArray(vote.profiles)) {
    return vote.profiles[0] ?? null;
  }

  return vote.profiles ?? null;
}

export function buildVoteBreakdown(votes: VoteWithProfile[] | null | undefined): VoteBreakdown {
  return (votes || []).reduce<VoteBreakdown>(
    (breakdown, vote) => {
      const direction = vote.value === 1 ? "up" : "down";
      const group = authorGroup(normalizeProfile(vote));

      breakdown[group][direction] += 1;
      breakdown.total[direction] += 1;
      breakdown.total.score += vote.value === 1 ? 1 : -1;

      return breakdown;
    },
    {
      civic: { ...emptyVoteBreakdown.civic },
      institutional: { ...emptyVoteBreakdown.institutional },
      total: { ...emptyVoteBreakdown.total }
    }
  );
}

export function formatVotePair(up: number, down: number) {
  return `+${up} / -${down}`;
}
