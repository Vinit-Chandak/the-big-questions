import { bootstrapAdminEmails } from "@/lib/env";
import { getAuthenticatedUser, jsonOk, parseJson, requireServiceClient, requireSupabase } from "@/lib/api";
import { onboardingSchema } from "@/lib/validation";
import type { Profile } from "@/lib/types";

export async function POST(request: Request) {
  const body = await parseJson(request, onboardingSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const userResult = await getAuthenticatedUser(supabaseResult.supabase!);
  if (userResult.response) return userResult.response;

  const serviceResult = requireServiceClient();
  if (serviceResult.response) return serviceResult.response;

  const user = userResult.user!;
  const { data: existing } = await serviceResult.service!
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const bootstrapAdmin = user.email ? bootstrapAdminEmails().has(user.email.toLowerCase()) : false;
  const existingProfile = (existing as Profile | null) ?? null;
  const nextUserType = existingProfile?.user_type === "admin" || bootstrapAdmin ? "admin" : existingProfile?.user_type ?? "civic";

  const { data, error } = await serviceResult.service!
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: body.data!.display_name,
        user_type: nextUserType,
        verification_status: existingProfile?.verification_status ?? "none",
        affiliation_org: existingProfile?.affiliation_org ?? null,
        affiliation_domain: existingProfile?.affiliation_domain ?? null,
        public_disclaimer: body.data!.public_disclaimer || null
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }

  return jsonOk({ profile: data });
}
