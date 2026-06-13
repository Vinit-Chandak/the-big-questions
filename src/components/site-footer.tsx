import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const footerLinks = [
  { href: "/", label: "This week's hearing" },
  { href: "/queue", label: "Question queue" },
  { href: "/verify", label: "Verification" },
  { href: "/login", label: "Sign in" }
];

export function SiteFooter() {
  return (
    <footer className="mt-14">
      <div className="mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-10">
        <div className="rule-masthead grid gap-8 pb-8 pt-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <BrandMark className="size-9 text-ink" />
              <p className="font-serif text-xl font-semibold leading-none">The Big Questions</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A serious public channel between the people building or governing AI and the people living with its
              effects. One question each week, answered on the record.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="type-kicker text-muted-foreground">Sections</p>
            <ul className="mt-3 grid gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="type-kicker text-muted-foreground">Taking part</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Reading is open to everyone. Writing views, voting, and follow-up requests require sign-in. Civic and
              institutional signals are always shown separately — never collapsed into one score.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-meta text-muted-foreground">
            © {new Date().getFullYear()} The Big Questions — a public record, in the open.
          </p>
          <p className="type-meta text-muted-foreground">Civic alpha edition</p>
        </div>
      </div>
    </footer>
  );
}
