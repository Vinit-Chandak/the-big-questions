import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { NavLinks, type NavItem } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { getViewer } from "@/lib/data";

function editionDate() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());
}

export async function SiteHeader() {
  const viewer = await getViewer();

  const navItems: NavItem[] = [
    { href: "/", label: "This week" },
    { href: "/queue", label: "Question queue" },
    { href: "/verify", label: "Verification" }
  ];
  if (viewer.profile?.user_type === "admin") {
    navItems.push({ href: "/admin", label: "Admin desk" });
  }

  return (
    <>
      {/* Edition strip */}
      <div className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[76rem] items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-10">
          <p className="type-meta truncate text-muted-foreground">A weekly civic hearing on artificial intelligence</p>
          <p className="type-meta shrink-0 text-muted-foreground" suppressHydrationWarning>
            {editionDate()}
          </p>
        </div>
      </div>

      {/* Masthead */}
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[76rem] items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4"
          >
            <BrandMark className="size-9 text-ink sm:size-12" />
            <span className="min-w-0">
              <span className="block truncate font-serif text-[1.28rem] font-semibold leading-none tracking-tight min-[26rem]:text-[1.55rem] sm:text-3xl">
                The Big Questions
              </span>
              <span className="type-meta mt-1.5 hidden text-muted-foreground sm:block">
                Citizens and institutions, on the record
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            {viewer.profile ? (
              <Link
                href="/onboarding"
                className="inline-flex h-10 max-w-40 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="hidden truncate sm:inline">{viewer.profile.display_name}</span>
                <span className="sr-only sm:hidden">Your profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-ink bg-ink px-3.5 text-sm font-semibold text-background outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <LogIn className="size-4" aria-hidden="true" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sticky section nav */}
      <nav
        aria-label="Main navigation"
        className="rule-masthead sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
      >
        <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-10">
          <NavLinks items={navItems} />
        </div>
      </nav>
    </>
  );
}
