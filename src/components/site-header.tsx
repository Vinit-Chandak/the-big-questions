import Link from "next/link";
import { Landmark, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getViewer } from "@/lib/data";

const navItems = [
  { href: "/", label: "Current" },
  { href: "/queue", label: "Queue" },
  { href: "/verify", label: "Verify" },
  { href: "/admin", label: "Admin" }
];

export async function SiteHeader() {
  const viewer = await getViewer();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/94 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 font-bold">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
              <Landmark className="size-4 text-primary" aria-hidden="true" />
            </span>
            <span className="truncate text-base sm:text-lg">The Big Questions</span>
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <nav aria-label="Main navigation" className="flex min-w-0 flex-wrap items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2.5 py-2 text-sm font-bold text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {viewer.profile ? (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/onboarding">
                <ShieldCheck className="size-4" aria-hidden="true" />
                <span className="max-w-36 truncate">{viewer.profile.display_name}</span>
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
