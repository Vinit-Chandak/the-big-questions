import {
  jsonError,
  jsonOk,
  parseJson,
  requireAdminProfile,
  requireServiceClient,
  requireSupabase
} from "@/lib/api";
import { adminQuestionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseJson(request, adminQuestionSchema);
  if (body.response) return body.response;

  if (body.data!.status === "active") {
    return jsonError("Use the publish endpoint to make a question active.", 422);
  }

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const adminResult = await requireAdminProfile(supabaseResult.supabase!);
  if (adminResult.response) return adminResult.response;

  const serviceResult = requireServiceClient();
  if (serviceResult.response) return serviceResult.response;

  const { data, error } = await serviceResult.service!
    .from("questions")
    .insert({
      title: body.data!.title,
      body: body.data!.body || null,
      origin: body.data!.origin,
      status: body.data!.status,
      submitted_by: adminResult.profile!.id,
      selection_note: body.data!.selection_note || null
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ question: data }, 201);
}
