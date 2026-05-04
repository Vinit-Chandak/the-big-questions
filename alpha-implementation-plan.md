# Alpha V1 Implementation Plan

## Summary
Create `alpha-implementation-plan.md` first, then implement the full alpha described in `implementation-plan.md` and `forum-design.md` as a new Next.js + Supabase app in the current repo, which currently contains only the two planning docs.

Locked decisions:
- Stack: Next.js App Router, TypeScript, Supabase Auth/Postgres, Vercel deployment.
- UI: Tailwind + shadcn/ui, lucide icons, mobile-first responsive layout.
- Auth: Supabase email magic link.
- Access: public read, login required to submit, vote, request follow-ups, verify, or administer.
- Admin: in-app admin from alpha, with first admin bootstrapped through `ADMIN_BOOTSTRAP_EMAILS`.
- Starters: admin-created only, no invented seed questions.
- Font: `@fontsource/ia-writer-quattro`, chosen as the practical Fontsource path for Zed-inspired typography. Zed's own attribution lists iA Writer Quattro S and IBM Plex.

## Key Changes
- Create a fresh app scaffold in repo root using the current stable Next.js App Router flow, with `src/`, Tailwind, ESLint, TypeScript, shadcn/ui, `next-themes`, and Supabase SSR clients.
- Add `alpha-implementation-plan.md` as the implementation contract before app code changes; leave `implementation-plan.md` and `forum-design.md` unchanged unless explicitly requested.
- Define design tokens for a calm civic editorial theme: readable neutral surfaces, muted teal/sage/amber accents, high contrast in light/dark mode, and no one-color dominant palette.
- Use responsive typography roles in `rem` with breakpoint/container-aware layouts, avoiding viewport-width font scaling. Test text overflow across narrow mobile through wide desktop.
- Add smooth dark mode through class-based theme tokens, persisted preference, system default support, hydration-safe rendering, and reduced-motion-aware color transitions.

## Product Implementation
- Public routes: home/current question, question detail, candidate question queue, verification request, auth login/callback, onboarding.
- Authenticated actions: submit candidate questions, vote on questions/views/follow-ups, write views, request follow-ups, reply to follow-ups, request verification.
- Admin routes: question creation/publishing/archive flow, candidate review, verification review, flags/moderation, follow-up status management, Bridge View editor.
- Supabase schema: implement the tables/enums from `implementation-plan.md`, plus necessary `updated_at` triggers, RLS policies, aggregate query helpers, and admin-safe review paths.
- API surface: implement the listed `/api/*` route handlers with Zod validation, Supabase SSR session handling, profile-based authorization, and consistent JSON error shapes.
- Voting: store `1` and `-1`, enforce one vote per user per target, and compute civic vs verified institutional breakdowns from voter profiles.
- Verification: distinguish civic, verified affiliation, and official representative labels everywhere author identity appears.
- Bridge View: admin-authored summary for each question covering civic views, institutional views, disagreements, unanswered concerns, and open follow-ups.
- Weekly publishing: implement admin publish/archive behavior first; add scheduled automation only after the manual flow works.

## Interfaces And Env
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ADMIN_BOOTSTRAP_EMAILS`, `NEXT_PUBLIC_SITE_URL`.
- Shared TypeScript types: user type, verification status, question status/origin, author group filter, view position, follow-up status, and vote value.
- Form payloads: plain free-text bodies, optional source links, optional personal/official view label for verified users, and short free-text follow-up requests.
- Admin bootstrap: during onboarding, authenticated users whose email appears in `ADMIN_BOOTSTRAP_EMAILS` receive `admin`; ordinary users cannot set their own role.

## Test Plan
- Run typecheck, lint, and production build.
- Add unit tests for validation schemas, role/group helpers, vote aggregation helpers, and theme token invariants where practical.
- Add API/RLS integration tests for public reads, authenticated writes, admin-only updates, duplicate vote prevention, verification review, and follow-up status changes.
- Add Playwright flows for public browsing, magic-link/onboarding substitute flow, candidate submission, voting, view posting, follow-up lifecycle, verification request, and admin publishing.
- Add responsive visual checks in light and dark mode at 320, 390, 768, 1024, 1440, and wide desktop widths, with explicit checks for overflow, clipped text, broken navigation, and inaccessible controls.
- Verify keyboard navigation, visible focus states, labels, aria names for icon buttons, contrast, and reduced-motion behavior.

## Assumptions And Sources
- No unresolved product choices remain from this planning pass.
- Git currently reports a safe-directory ownership issue for this checkout; implementation should avoid Git-dependent steps until that is resolved or explicitly approved.
- Sources used: [Zed attributions](https://zed.dev/attributions), [Fontsource iA Writer Quattro](https://fontsource.org/fonts/ia-writer-quattro), [Next.js App Router docs](https://nextjs.org/docs/app), [Supabase SSR client docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&queryGroups=framework), [shadcn dark mode docs](https://ui.shadcn.com/docs/dark-mode/next).
