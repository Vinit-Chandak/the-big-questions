import type { Profile, VerificationStatus, ViewPosition } from "@/lib/types";

export function isAdmin(profile: Pick<Profile, "user_type"> | null | undefined) {
  return profile?.user_type === "admin";
}

export function isVerifiedInstitutionalStatus(status: VerificationStatus | null | undefined) {
  return status === "verified_affiliation" || status === "official_representative";
}

export function isInstitutionalProfile(
  profile: Pick<Profile, "user_type" | "verification_status"> | null | undefined
) {
  if (!profile) {
    return false;
  }

  return profile.user_type !== "civic" && isVerifiedInstitutionalStatus(profile.verification_status);
}

export function canSubmitOfficialView(profile: Pick<Profile, "verification_status"> | null | undefined) {
  return profile?.verification_status === "official_representative";
}

export function authorGroup(profile: Pick<Profile, "user_type" | "verification_status"> | null | undefined) {
  return isInstitutionalProfile(profile) ? "institutional" : "civic";
}

export function verificationLabel(profile: Pick<Profile, "verification_status" | "affiliation_org" | "user_type">) {
  if (profile.verification_status === "official_representative") {
    return `Official response${profile.affiliation_org ? `: ${profile.affiliation_org}` : ""}`;
  }

  if (profile.verification_status === "verified_affiliation") {
    return `Verified affiliation${profile.affiliation_org ? `: ${profile.affiliation_org}` : ""}`;
  }

  if (profile.verification_status === "pending") {
    return "Verification pending";
  }

  if (profile.user_type === "admin") {
    return "Admin";
  }

  return "Civic user";
}

export function positionLabel(position: ViewPosition) {
  if (position === "official_response") {
    return "Official response";
  }

  if (position === "personal_view") {
    return "Personal view";
  }

  return "View";
}
