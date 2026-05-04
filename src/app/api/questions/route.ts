import { jsonOk, parseJson, requireProfile, requireSupabase } from "@/lib/api";
import { candidateQuestionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseJson(request, candidateQuestionSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const profileResult = await requireProfile(supabaseResult.supabase!);
  if (profileResult.response) return profileResult.response;

  const { data, error } = await supabaseResult.supabase!
    .from("questions")
    .insert({
      title: body.data!.title,
      body: body.data!.body || null,
      status: "submitted",
      origin: "public_submission",
      submitted_by: profileResult.profile!.id
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ question: data }, 201);
}
