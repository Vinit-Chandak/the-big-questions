import { jsonOk, parseJson, requireProfile, requireSupabase } from "@/lib/api";
import { followUpSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseJson(request, followUpSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const profileResult = await requireProfile(supabaseResult.supabase!);
  if (profileResult.response) return profileResult.response;

  let requestedTo: string | null = null;

  if (body.data!.target_view_id) {
    const { data: view, error: viewError } = await supabaseResult.supabase!
      .from("question_views")
      .select("author_id")
      .eq("id", body.data!.target_view_id)
      .single();

    if (viewError) {
      return Response.json({ error: { message: viewError.message } }, { status: 404 });
    }

    requestedTo = view.author_id;
  }

  const { data, error } = await supabaseResult.supabase!
    .from("follow_up_requests")
    .insert({
      question_id: body.data!.question_id,
      target_view_id: body.data!.target_view_id ?? null,
      requested_by: profileResult.profile!.id,
      requested_to: requestedTo,
      body: body.data!.body
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ follow_up: data }, 201);
}
