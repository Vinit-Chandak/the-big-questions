import { describe, expect, it } from "vitest";
import { candidateQuestionSchema, verificationRequestSchema, viewSchema, voteSchema } from "@/lib/validation";

describe("validation schemas", () => {
  it("accepts only explicit upvote or downvote values", () => {
    expect(voteSchema.safeParse({ value: 1 }).success).toBe(true);
    expect(voteSchema.safeParse({ value: -1 }).success).toBe(true);
    expect(voteSchema.safeParse({ value: 0 }).success).toBe(false);
  });

  it("requires candidate questions to be substantial enough for review", () => {
    expect(candidateQuestionSchema.safeParse({ title: "Too short" }).success).toBe(false);
    expect(candidateQuestionSchema.safeParse({ title: "Should frontier AI labs publish safety eval failures?" }).success).toBe(true);
  });

  it("requires official view source URLs to be valid URLs when provided", () => {
    const result = viewSchema.safeParse({
      question_id: "00000000-0000-4000-8000-000000000000",
      body: "This is a sufficiently long view body for the schema to accept.",
      position: "personal_view",
      source_urls: ["https://example.org/source"]
    });

    expect(result.success).toBe(true);
  });

  it("restricts verification requests to affiliation or official representative status", () => {
    expect(
      verificationRequestSchema.safeParse({
        requested_status: "verified_affiliation",
        affiliation_org: "Example Lab"
      }).success
    ).toBe(true);

    expect(
      verificationRequestSchema.safeParse({
        requested_status: "none",
        affiliation_org: "Example Lab"
      }).success
    ).toBe(false);
  });
});
