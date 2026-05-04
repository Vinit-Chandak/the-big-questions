import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AuthorGroup } from "@/lib/types";

const tabs: Array<{ value: AuthorGroup; label: string }> = [
  { value: "all", label: "All" },
  { value: "civic", label: "Civic" },
  { value: "institutional", label: "Verified" }
];

export function FilterTabs({ questionId, active }: { questionId: string; active: AuthorGroup }) {
  return (
    <div className="flex w-full flex-wrap gap-2 rounded-lg border border-border bg-muted p-1 sm:w-fit">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={`/questions/${questionId}?group=${tab.value}`}
          className={cn(
            "flex min-h-9 flex-1 items-center justify-center rounded-md px-3 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none",
            active === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
