import { z } from "zod";
import {
  followUpStatuses,
  questionOrigins,
  questionStatuses,
  userTypes,
  verificationStatuses,
  viewPositions
} from "@/lib/types";

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const urlText = z.string().trim().url().max(500);

export const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)])
});

export const candidateQuestionSchema = z.object({
  title: text(12, 180),
  body: optionalText(2000)
});

export const adminQuestionSchema = z.object({
  title: text(12, 180),
  body: optionalText(3000),
  origin: z.enum(questionOrigins).default("admin_created"),
  status: z.enum(questionStatuses).default("submitted"),
  selection_note: optionalText(1200)
});

export const publishQuestionSchema = z.object({
  selection_note: text(12, 1200)
});

export const viewSchema = z.object({
  question_id: z.string().uuid(),
  body: text(20, 8000),
  position: z.enum(viewPositions).default("unspecified"),
  source_urls: z.array(urlText).max(8).default([])
});

export const followUpSchema = z.object({
  question_id: z.string().uuid(),
  target_view_id: z.string().uuid().nullable().optional(),
  body: text(8, 700)
});

export const followUpReplySchema = z.object({
  body: text(4, 3000)
});

export const followUpStatusSchema = z.object({
  status: z.enum(followUpStatuses)
});

export const verificationRequestSchema = z.object({
  requested_status: z.enum(["verified_affiliation", "official_representative"]),
  affiliation_org: text(2, 140),
  evidence_url: optionalText(500).refine((value) => !value || z.string().url().safeParse(value).success, {
    message: "Evidence URL must be a valid URL."
  }),
  evidence_email_domain: optionalText(140),
  notes: optionalText(2000)
});

export const verificationReviewSchema = z.object({
  user_id: z.string().uuid(),
  approved_status: z.enum(verificationStatuses),
  user_type: z.enum(userTypes).optional(),
  affiliation_org: optionalText(140),
  affiliation_domain: optionalText(140)
});

export const bridgeSchema = z.object({
  question_id: z.string().uuid(),
  strongest_civic_views: optionalText(4000),
  strongest_institutional_views: optionalText(4000),
  disagreements: optionalText(4000),
  unanswered_concerns: optionalText(4000),
  open_follow_ups: optionalText(4000)
});

export const flagSchema = z.object({
  reason: text(4, 1000)
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  next: z.string().trim().max(500).optional()
});

export const onboardingSchema = z.object({
  display_name: text(2, 80),
  public_disclaimer: optionalText(500)
});
