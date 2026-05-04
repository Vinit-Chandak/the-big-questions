import { NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const supabase = await createSupabaseServerClient();

  if (code && supabase) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const next = safeRedirectPath(requestUrl.searchParams.get("next"), "/onboarding");
  const onboardingUrl = new URL("/onboarding", request.url);

  if (next !== "/onboarding") {
    onboardingUrl.searchParams.set("next", next);
  }

  return NextResponse.redirect(onboardingUrl);
}
