import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { ZodSchema } from "zod";
import { createSupabaseServiceClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import type { Profile } from "@/lib/types";

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        message,
        details
      }
    },
    { status }
  );
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return {
      data: null,
      response: jsonError("Request body must be valid JSON.", 400)
    };
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      data: null,
      response: jsonError("Request body failed validation.", 422, result.error.flatten())
    };
  }

  return {
    data: result.data,
    response: null
  };
}

export async function requireSupabase() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      supabase: null,
      response: jsonError("Supabase environment variables are not configured.", 503)
    };
  }

  return {
    supabase,
    response: null
  };
}

export async function getAuthenticatedUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      response: jsonError("Sign in is required for this action.", 401)
    };
  }

  return {
    user,
    response: null
  };
}

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) {
    return {
      profile: null,
      response: jsonError(error.message, 500)
    };
  }

  if (!data) {
    return {
      profile: null,
      response: jsonError("Finish onboarding before using authenticated actions.", 403)
    };
  }

  return {
    profile: data as Profile,
    response: null
  };
}

export async function requireProfile(supabase: SupabaseClient) {
  const userResult = await getAuthenticatedUser(supabase);

  if (userResult.response) {
    return {
      user: null,
      profile: null,
      response: userResult.response
    };
  }

  const profileResult = await getProfile(supabase, userResult.user!.id);

  if (profileResult.response) {
    return {
      user: userResult.user,
      profile: null,
      response: profileResult.response
    };
  }

  return {
    user: userResult.user as User,
    profile: profileResult.profile,
    response: null
  };
}

export async function requireAdminProfile(supabase: SupabaseClient) {
  const profileResult = await requireProfile(supabase);

  if (profileResult.response) {
    return profileResult;
  }

  if (!isAdmin(profileResult.profile)) {
    return {
      user: profileResult.user,
      profile: profileResult.profile,
      response: jsonError("Admin access is required for this action.", 403)
    };
  }

  return profileResult;
}

export function requireServiceClient() {
  const service = createSupabaseServiceClient();

  if (!service) {
    return {
      service: null,
      response: jsonError("Supabase service key is not configured.", 503)
    };
  }

  return {
    service,
    response: null
  };
}
