import { jsonOk, requireProfile, requireSupabase } from "@/lib/api";

export async function GET() {
  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const supabase = supabaseResult.supabase!;
  const profileResult = await requireProfile(supabase);
  const isAdmin = profileResult.profile?.user_type === "admin";
  const statuses = isAdmin ? ["submitted", "shortlisted", "active", "archived", "rejected"] : ["submitted", "shortlisted"];

  const { data, error } = await supabase
    .from("questions")
    .select("*, question_votes(value, profiles:user_id(user_type, verification_status))")
    .in("status", statuses)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ questions: data });
}
