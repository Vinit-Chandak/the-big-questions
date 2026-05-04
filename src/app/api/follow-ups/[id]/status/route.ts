import { jsonError, jsonOk, parseJson, requireProfile, requireSupabase } from "@/lib/api";
import { isAdmin } from "@/lib/roles";
import { followUpStatusSchema } from "@/lib/validation";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await parseJson(request, followUpStatusSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const profileResult = await requireProfile(supabaseResult.supabase!);
  if (profileResult.response) return profileResult.response;

  const { data: followUp, error: followUpError } = await supabaseResult.supabase!
    .from("follow_up_requests")
    .select("requested_to")
    .eq("id", id)
    .single();

  if (followUpError) {
    return Response.json({ error: { message: followUpError.message } }, { status: 404 });
  }

  const canChangeStatus = isAdmin(profileResult.profile) || followUp.requested_to === profileResult.profile!.id;

  if (!canChangeStatus) {
    return jsonError("Only the requested respondent or an admin can change this follow-up status.", 403);
  }

  const { data, error } = await supabaseResult.supabase!
    .from("follow_up_requests")
    .update({ status: body.data!.status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ follow_up: data });
}
