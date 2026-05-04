import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canSubmitOfficialView } from "@/lib/roles";
import { buildVoteBreakdown, type VoteBreakdown } from "@/lib/votes";
import type { AuthorGroup, BridgeSummary, FollowUpRequest, Profile, Question, QuestionView, VoteWithProfile } from "@/lib/types";

export type Viewer = {
  profile: Profile | null;
  canSubmitOfficial: boolean;
  configured: boolean;
  isAuthenticated: boolean;
};

export type QuestionWithVotes = Question & {
  question_votes?: unknown[] | null;
  voteBreakdown: VoteBreakdown;
};

export async function getViewer(): Promise<Viewer> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      profile: null,
      canSubmitOfficial: false,
      configured: false,
      isAuthenticated: false
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      canSubmitOfficial: false,
      configured: true,
      isAuthenticated: false
    };
  }

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = (data as Profile | null) ?? null;

  return {
    profile,
    canSubmitOfficial: canSubmitOfficialView(profile),
    configured: true,
    isAuthenticated: true
  };
}

export async function getCurrentQuestion() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("questions")
    .select(
      "*, question_votes(value, profiles:user_id(user_type, verification_status)), bridge_summaries(*)"
    )
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    ...(data as QuestionWithVotes),
    voteBreakdown: buildVoteBreakdown((data as { question_votes?: never[] }).question_votes)
  };
}

export async function getCandidateQuestions(limit = 8) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("questions")
    .select("*, question_votes(value, profiles:user_id(user_type, verification_status))")
    .in("status", ["submitted", "shortlisted"])
    .order("created_at", { ascending: false })
    .limit(limit);

  return ((data || []) as QuestionWithVotes[]).map((question) => ({
    ...question,
    voteBreakdown: buildVoteBreakdown(question.question_votes as never[])
  }));
}

export async function getQuestionDetail(questionId: string, authorGroup: AuthorGroup = "all") {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const [{ data: question }, { data: views }, { data: followUps }, { data: bridge }] = await Promise.all([
    supabase
      .from("questions")
      .select("*, question_votes(value, profiles:user_id(user_type, verification_status))")
      .eq("id", questionId)
      .maybeSingle(),
    supabase
      .from("question_views")
      .select(
        "*, profiles:author_id(*), view_votes(value, profiles:user_id(user_type, verification_status))"
      )
      .eq("question_id", questionId)
      .order("created_at", { ascending: false }),
    supabase
      .from("follow_up_requests")
      .select(
        "*, profiles:requested_by(*), follow_up_votes(value, profiles:user_id(user_type, verification_status)), follow_up_replies(*, profiles:author_id(*))"
      )
      .eq("question_id", questionId)
      .order("created_at", { ascending: false }),
    supabase
      .from("bridge_summaries")
      .select("*")
      .eq("question_id", questionId)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle()
  ]);

  if (!question) {
    return null;
  }

  const filteredViews = ((views || []) as QuestionView[]).filter((view) => {
    if (authorGroup === "all") {
      return true;
    }

    const institutional =
      view.profiles?.verification_status === "verified_affiliation" ||
      view.profiles?.verification_status === "official_representative";

    return authorGroup === "institutional" ? institutional : !institutional;
  });

  return {
    question: {
      ...(question as QuestionWithVotes),
      voteBreakdown: buildVoteBreakdown((question as { question_votes?: VoteWithProfile[] }).question_votes)
    },
    views: filteredViews.map((view) => ({
      ...view,
      voteBreakdown: buildVoteBreakdown(view.view_votes)
    })),
    followUps: ((followUps || []) as FollowUpRequest[]).map((followUp) => ({
      ...followUp,
      voteBreakdown: buildVoteBreakdown(followUp.follow_up_votes)
    })),
    bridge: (bridge as BridgeSummary | null) ?? null
  };
}
