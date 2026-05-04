import { parseJson, jsonOk, requireSupabase } from "@/lib/api";
import { siteUrl } from "@/lib/env";
import { safeRedirectPath } from "@/lib/redirects";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseJson(request, loginSchema);
  if (body.response) return body.response;

  const supabaseResult = await requireSupabase();
  if (supabaseResult.response) return supabaseResult.response;

  const { error } = await supabaseResult.supabase!.auth.signInWithOtp({
    email: body.data!.email,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(safeRedirectPath(body.data!.next, "/onboarding"))}`
    }
  });

  if (error) {
    return Response.json({ error: { message: error.message } }, { status: 400 });
  }

  return jsonOk({ sent: true });
}
