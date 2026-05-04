import { jsonError, jsonOk, requireSupabase } from "@/lib/api";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const questionId = url.searchParams.get("question_id");

  if (!questionId) {
    return jsonError("question_id is required.", 422);
  }

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const { data, error } = await supabaseResult.supabase!
    .from("bridge_summaries")
    .select("*")
    .eq("question_id", questionId)
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ bridge: data });
}
