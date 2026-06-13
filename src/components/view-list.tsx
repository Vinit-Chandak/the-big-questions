import Link from "next/link";
import { ExternalLink, MessageSquarePlus } from "lucide-react";
import { FollowUpForm } from "@/components/forms/follow-up-form";
import { FlagViewForm } from "@/components/forms/flag-view-form";
import { Badge } from "@/components/ui/badge";
import { Kicker } from "@/components/kicker";
import { Ornament } from "@/components/ornaments";
import { Panel } from "@/components/ui/panel";
import { VoteButtons } from "@/components/vote-buttons";
import { authorGroup, positionLabel, verificationLabel } from "@/lib/roles";
import type { QuestionView } from "@/lib/types";
import type { VoteBreakdown } from "@/lib/votes";

type ViewWithBreakdown = QuestionView & {
  voteBreakdown: VoteBreakdown;
};

type ViewListProps = {
  questionId: string;
  views: ViewWithBreakdown[];
};

function sourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ViewList({ questionId, views }: ViewListProps) {
  if (views.length === 0) {
    return (
      <Panel className="grid justify-items-center gap-4 py-10 text-center">
        <Ornament name="quill" className="h-14 text-muted-foreground/80" />
        <div className="grid max-w-md justify-items-center gap-2">
          <Kicker>Views</Kicker>
          <h2 className="type-title text-balance">No views on the record yet — under this reading mode.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            Views appear here when signed-in civic or verified institutional participants write their response in
            their own words.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4">
      {views.map((view) => {
        const group = view.profiles ? authorGroup(view.profiles) : "civic";
        return (
          <Panel key={view.id} className="grid gap-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  {view.profiles ? (
                    <Badge variant={group === "institutional" ? "institutional" : "civic"}>
                      {verificationLabel(view.profiles)}
                    </Badge>
                  ) : null}
                  {view.position !== "unspecified" ? (
                    <Badge variant={view.position === "official_response" ? "amber" : "outline"}>
                      {positionLabel(view.position)}
                    </Badge>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold break-anywhere">
                    {view.profiles?.display_name || "Unknown author"}
                  </h3>
                  {view.profiles?.public_disclaimer ? (
                    <p className="type-meta italic text-muted-foreground break-anywhere">
                      {view.profiles.public_disclaimer}
                    </p>
                  ) : null}
                </div>

                <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-foreground text-pretty break-anywhere">
                  {view.body}
                </p>

                {view.source_urls?.length ? (
                  <div className="border-t border-border pt-3">
                    <p className="type-kicker text-muted-foreground">Sources</p>
                    <ol className="mt-2 grid gap-1.5">
                      {view.source_urls.map((source, index) => (
                        <li key={source} className="flex min-w-0 items-baseline gap-2">
                          <span className="type-meta shrink-0 tabular-nums text-muted-foreground">{index + 1}.</span>
                          <Link
                            href={source}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span className="truncate">{sourceHost(source)}</span>
                            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>

              <VoteButtons endpoint={`/api/views/${view.id}/vote`} breakdown={view.voteBreakdown} label="view" />
            </div>

            <div className="grid gap-3 border-t border-border pt-4">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-foreground/85 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <MessageSquarePlus className="size-4 text-muted-foreground" aria-hidden="true" />
                  Ask this author to clarify
                  <span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-90">
                    ›
                  </span>
                </summary>
                <div className="mt-3 rounded-md border border-border bg-muted/40 p-3 sm:p-4">
                  <FollowUpForm questionId={questionId} targetViewId={view.id} compact />
                </div>
              </details>
              <FlagViewForm viewId={view.id} />
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
