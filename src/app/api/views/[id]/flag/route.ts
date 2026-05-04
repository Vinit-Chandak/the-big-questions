import { jsonOk, parseJson, requireProfile, requireSupabase } from "@/lib/api";
import { flagSchema } from "@/lib/validation";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await parseJson(request, flagSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const profileResult = await requireProfile(supabaseResult.supabase!);
  if (profileResult.response) return profileResult.response;

  const { data, error } = await supabaseResult.supabase!
    .from("content_flags")
    .insert({
      view_id: id,
      reporter_id: profileResult.profile!.id,
      reason: body.data!.reason
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ flag: data }, 201);
}
