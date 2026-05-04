import {
  jsonOk,
  parseJson,
  requireAdminProfile,
  requireServiceClient,
  requireSupabase
} from "@/lib/api";
import { publishQuestionSchema } from "@/lib/validation";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await parseJson(request, publishQuestionSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const adminResult = await requireAdminProfile(supabaseResult.supabase!);
  if (adminResult.response) return adminResult.response;

  const serviceResult = requireServiceClient();
  if (serviceResult.response) return serviceResult.response;

  const now = new Date().toISOString();
  const archive = await serviceResult.service!
    .from("questions")
    .update({ status: "archived", archived_at: now })
    .eq("status", "active");

  if (archive.error) {
    return Response.json({ error: { message: archive.error.message } }, { status: 500 });
  }

  const { data, error } = await serviceResult.service!
    .from("questions")
    .update({
      status: "active",
      selection_note: body.data!.selection_note,
      published_at: now,
      archived_at: null
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ question: data });
}
