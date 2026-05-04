export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  ADMIN_BOOTSTRAP_EMAILS: process.env.ADMIN_BOOTSTRAP_EMAILS,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
};

export function hasPublicSupabaseEnv() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function hasServiceSupabaseEnv() {
  return Boolean(hasPublicSupabaseEnv() && env.SUPABASE_SECRET_KEY);
}

export function siteUrl() {
  return env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function bootstrapAdminEmails() {
  return new Set(
    (env.ADMIN_BOOTSTRAP_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}
