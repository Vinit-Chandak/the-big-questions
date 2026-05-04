import { jsonOk, requireSupabase } from "@/lib/api";

export async function GET() {
  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const { data, error } = await supabaseResult.supabase!
    .from("questions")
    .select("*, question_votes(value, profiles:user_id(user_type, verification_status)), bridge_summaries(*)")
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ question: data });
}
