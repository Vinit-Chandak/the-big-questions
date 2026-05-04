import { jsonOk, parseJson, requireProfile, requireSupabase } from "@/lib/api";
import { voteSchema } from "@/lib/validation";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await parseJson(request, voteSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const profileResult = await requireProfile(supabaseResult.supabase!);
  if (profileResult.response) return profileResult.response;

  const { data, error } = await supabaseResult.supabase!
    .from("view_votes")
    .upsert(
      {
        view_id: id,
        user_id: profileResult.profile!.id,
        value: body.data!.value
      },
      { onConflict: "view_id,user_id" }
    )
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ vote: data });
}
