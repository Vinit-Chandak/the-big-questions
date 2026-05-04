import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { env, hasPublicSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  if (!hasPublicSupabaseEnv()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot write cookies; middleware and route handlers refresh sessions.
          }
        }
      }
    }
  );
}

export function createSupabaseServiceClient() {
  if (!hasServiceSupabaseEnv()) {
    return null;
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SECRET_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
