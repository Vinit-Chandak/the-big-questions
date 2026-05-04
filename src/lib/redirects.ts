export function safeRedirectPath(value: string | null | undefined, fallback = "/onboarding") {
  if (!value) {
    return fallback;
  }

  let decoded = value.trim();

  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\") || decoded.includes(":")) {
    return fallback;
  }

  return decoded;
}

export function loginPath(next = "/verify") {
  return `/login?next=${encodeURIComponent(safeRedirectPath(next, "/verify"))}`;
}
