import { jsonError, jsonOk, parseJson, requireProfile, requireSupabase } from "@/lib/api";
import { authorGroup as getAuthorGroup, canSubmitOfficialView } from "@/lib/roles";
import { viewSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const questionId = url.searchParams.get("question_id");
  const authorGroup = url.searchParams.get("author_group") || "all";

  if (!questionId) {
    return jsonError("question_id is required.", 422);
  }

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const { data, error } = await supabaseResult.supabase!
    .from("question_views")
    .select("*, profiles:author_id(*), view_votes(value, profiles:user_id(user_type, verification_status))")
    .eq("question_id", questionId)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  const filtered =
    authorGroup === "all"
      ? data
      : (data || []).filter((view) => getAuthorGroup(view.profiles) === authorGroup);

  return jsonOk({ views: filtered });
}

export async function POST(request: Request) {
  const body = await parseJson(request, viewSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const profileResult = await requireProfile(supabaseResult.supabase!);
  if (profileResult.response) return profileResult.response;

  if (body.data!.position === "official_response" && !canSubmitOfficialView(profileResult.profile)) {
    return jsonError("Official responses require official representative verification.", 403);
  }

  const { data, error } = await supabaseResult.supabase!
    .from("question_views")
    .insert({
      question_id: body.data!.question_id,
      author_id: profileResult.profile!.id,
      body: body.data!.body,
      position: body.data!.position,
      source_urls: body.data!.source_urls
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ view: data }, 201);
}
