import {
  jsonOk,
  parseJson,
  requireAdminProfile,
  requireServiceClient,
  requireSupabase
} from "@/lib/api";
import { verificationReviewSchema } from "@/lib/validation";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await parseJson(request, verificationReviewSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const adminResult = await requireAdminProfile(supabaseResult.supabase!);
  if (adminResult.response) return adminResult.response;

  const serviceResult = requireServiceClient();
  if (serviceResult.response) return serviceResult.response;

  const reviewedAt = new Date().toISOString();
  const { error: requestError } = await serviceResult.service!
    .from("verification_requests")
    .update({
      reviewed_by: adminResult.profile!.id,
      reviewed_at: reviewedAt
    })
    .eq("id", id);

  if (requestError) {
    return Response.json({ error: { message: requestError.message } }, { status: 500 });
  }

  const profileUpdate: Record<string, string | null> = {
    verification_status: body.data!.approved_status,
    affiliation_org: body.data!.affiliation_org || null,
    affiliation_domain: body.data!.affiliation_domain || null
  };

  if (body.data!.approved_status !== "rejected" && body.data!.user_type) {
    profileUpdate.user_type = body.data!.user_type;
  }

  const { data, error } = await serviceResult.service!
    .from("profiles")
    .update(profileUpdate)
    .eq("id", body.data!.user_id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ profile: data });
}
