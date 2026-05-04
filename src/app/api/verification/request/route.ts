import { jsonOk, parseJson, requireProfile, requireSupabase } from "@/lib/api";
import { verificationRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseJson(request, verificationRequestSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const profileResult = await requireProfile(supabaseResult.supabase!);
  if (profileResult.response) return profileResult.response;

  const { data, error } = await supabaseResult.supabase!
    .from("verification_requests")
    .insert({
      user_id: profileResult.profile!.id,
      requested_status: body.data!.requested_status,
      affiliation_org: body.data!.affiliation_org,
      evidence_url: body.data!.evidence_url || null,
      evidence_email_domain: body.data!.evidence_email_domain || null,
      notes: body.data!.notes || null
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ request: data }, 201);
}
