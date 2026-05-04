import { describe, expect, it } from "vitest";
import { canSubmitOfficialView, isInstitutionalProfile, verificationLabel } from "@/lib/roles";

describe("role helpers", () => {
  it("treats verified non-civic profiles as institutional", () => {
    expect(isInstitutionalProfile({ user_type: "lab", verification_status: "verified_affiliation" })).toBe(true);
    expect(isInstitutionalProfile({ user_type: "academic", verification_status: "official_representative" })).toBe(true);
  });

  it("does not treat unverified institutional categories as institutional readers", () => {
    expect(isInstitutionalProfile({ user_type: "lab", verification_status: "none" })).toBe(false);
    expect(isInstitutionalProfile({ user_type: "civic", verification_status: "verified_affiliation" })).toBe(false);
  });

  it("only allows official representatives to submit official views", () => {
    expect(canSubmitOfficialView({ verification_status: "official_representative" })).toBe(true);
    expect(canSubmitOfficialView({ verification_status: "verified_affiliation" })).toBe(false);
  });

  it("labels official representation separately from affiliation", () => {
    expect(
      verificationLabel({
        user_type: "policy",
        verification_status: "official_representative",
        affiliation_org: "Office of X"
      })
    ).toContain("Official response");
  });
});
