import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AuthorGroup } from "@/lib/types";

const tabs: Array<{ value: AuthorGroup; label: string; dot?: string }> = [
  { value: "all", label: "All views" },
  { value: "civic", label: "Civic", dot: "bg-civic" },
  { value: "institutional", label: "Verified institutional", dot: "bg-institutional" }
];

export function FilterTabs({ questionId, active }: { questionId: string; active: AuthorGroup }) {
  return (
    <nav aria-label="Reading mode" className="w-full overflow-x-auto border-b border-border">
      <ul className="flex min-w-max items-stretch gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <li key={tab.value}>
              <Link
                href={`/questions/${questionId}?group=${tab.value}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-11 items-center gap-2 px-2.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.dot ? <span aria-hidden="true" className={cn("size-2 rounded-full", tab.dot)} /> : null}
                {tab.label}
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-x-1 bottom-0 h-0.5", isActive ? "bg-ink" : "bg-transparent")}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
