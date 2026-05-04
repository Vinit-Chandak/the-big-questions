export const userTypes = [
  "civic",
  "lab",
  "policy",
  "academic",
  "journalist",
  "civil_society",
  "admin"
] as const;

export type UserType = (typeof userTypes)[number];

export const verificationStatuses = [
  "none",
  "pending",
  "verified_affiliation",
  "official_representative",
  "rejected"
] as const;

export type VerificationStatus = (typeof verificationStatuses)[number];

export const questionStatuses = ["submitted", "shortlisted", "active", "archived", "rejected"] as const;
export type QuestionStatus = (typeof questionStatuses)[number];

export const questionOrigins = ["starter", "public_submission", "admin_created"] as const;
export type QuestionOrigin = (typeof questionOrigins)[number];

export const authorGroups = ["all", "civic", "institutional"] as const;
export type AuthorGroup = (typeof authorGroups)[number];

export const viewPositions = ["personal_view", "official_response", "unspecified"] as const;
export type ViewPosition = (typeof viewPositions)[number];

export const followUpStatuses = ["open", "answered", "declined", "closed"] as const;
export type FollowUpStatus = (typeof followUpStatuses)[number];

export type VoteValue = -1 | 1;

export type Profile = {
  id: string;
  display_name: string;
  user_type: UserType;
  verification_status: VerificationStatus;
  affiliation_org: string | null;
  affiliation_domain: string | null;
  public_disclaimer: string | null;
  created_at?: string | null;
};

export type Question = {
  id: string;
  title: string;
  body: string | null;
  status: QuestionStatus;
  origin: QuestionOrigin;
  submitted_by: string | null;
  selection_note: string | null;
  published_at: string | null;
  archived_at: string | null;
  created_at: string | null;
};

export type QuestionView = {
  id: string;
  question_id: string;
  author_id: string;
  position: ViewPosition;
  body: string;
  source_urls: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  profiles?: Profile | null;
  view_votes?: VoteWithProfile[] | null;
};

export type FollowUpRequest = {
  id: string;
  question_id: string;
  target_view_id: string | null;
  requested_by: string;
  requested_to: string | null;
  body: string;
  status: FollowUpStatus;
  created_at: string | null;
  updated_at: string | null;
  profiles?: Profile | null;
  follow_up_votes?: VoteWithProfile[] | null;
  follow_up_replies?: FollowUpReply[] | null;
};

export type FollowUpReply = {
  id: string;
  follow_up_id: string;
  author_id: string;
  body: string;
  created_at: string | null;
  profiles?: Profile | null;
};

export type BridgeSummary = {
  id: string;
  question_id: string;
  author_id: string;
  strongest_civic_views: string | null;
  strongest_institutional_views: string | null;
  disagreements: string | null;
  unanswered_concerns: string | null;
  open_follow_ups: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type VoteWithProfile = {
  value: number;
  profiles?: Pick<Profile, "user_type" | "verification_status"> | Pick<Profile, "user_type" | "verification_status">[] | null;
};
