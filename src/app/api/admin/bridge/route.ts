import {
  jsonOk,
  parseJson,
  requireAdminProfile,
  requireServiceClient,
  requireSupabase
} from "@/lib/api";
import { bridgeSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseJson(request, bridgeSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const adminResult = await requireAdminProfile(supabaseResult.supabase!);
  if (adminResult.response) return adminResult.response;

  const serviceResult = requireServiceClient();
  if (serviceResult.response) return serviceResult.response;

  const { data, error } = await serviceResult.service!
    .from("bridge_summaries")
    .upsert(
      {
        question_id: body.data!.question_id,
        author_id: adminResult.profile!.id,
        strongest_civic_views: body.data!.strongest_civic_views || null,
        strongest_institutional_views: body.data!.strongest_institutional_views || null,
        disagreements: body.data!.disagreements || null,
        unanswered_concerns: body.data!.unanswered_concerns || null,
        open_follow_ups: body.data!.open_follow_ups || null
      },
      { onConflict: "question_id" }
    )
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ bridge: data });
}
