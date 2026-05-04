import { describe, expect, it } from "vitest";
import { buildVoteBreakdown } from "@/lib/votes";

describe("vote aggregation", () => {
  it("keeps civic and verified institutional vote signals separate", () => {
    const breakdown = buildVoteBreakdown([
      { value: 1, profiles: { user_type: "civic", verification_status: "none" } },
      { value: -1, profiles: { user_type: "civic", verification_status: "none" } },
      { value: 1, profiles: { user_type: "lab", verification_status: "verified_affiliation" } },
      { value: -1, profiles: { user_type: "policy", verification_status: "official_representative" } },
      { value: 1, profiles: { user_type: "academic", verification_status: "none" } }
    ]);

    expect(breakdown.civic).toEqual({ up: 2, down: 1 });
    expect(breakdown.institutional).toEqual({ up: 1, down: 1 });
    expect(breakdown.total).toEqual({ up: 3, down: 2, score: 1 });
  });
});
