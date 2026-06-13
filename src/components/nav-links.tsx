"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string };

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex min-w-0 items-stretch gap-1 overflow-x-auto sm:gap-2">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-11 items-center px-2.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-2 bottom-0 h-0.5 transition-colors",
                  active ? "bg-ink" : "bg-transparent"
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
