import Link from "next/link";
import { ExternalLink, MessageSquarePlus } from "lucide-react";
import { FollowUpForm } from "@/components/forms/follow-up-form";
import { FlagViewForm } from "@/components/forms/flag-view-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { VoteButtons } from "@/components/vote-buttons";
import { positionLabel, verificationLabel } from "@/lib/roles";
import type { QuestionView } from "@/lib/types";
import type { VoteBreakdown } from "@/lib/votes";

type ViewWithBreakdown = QuestionView & {
  voteBreakdown: VoteBreakdown;
};

type ViewListProps = {
  questionId: string;
  views: ViewWithBreakdown[];
};

export function ViewList({ questionId, views }: ViewListProps) {
  if (views.length === 0) {
    return (
      <Panel className="grid gap-3">
        <Badge variant="muted" className="w-fit">
          Views
        </Badge>
        <h2 className="text-xl font-bold text-balance">No views match this reading mode yet.</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Views appear after signed-in civic or verified institutional users post free-text responses.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4">
      {views.map((view) => (
        <Panel key={view.id} className="grid gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={view.position === "official_response" ? "amber" : "outline"}>
                  {positionLabel(view.position)}
                </Badge>
                {view.profiles ? <Badge variant="secondary">{verificationLabel(view.profiles)}</Badge> : null}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold break-anywhere">{view.profiles?.display_name || "Unknown author"}</h3>
                {view.profiles?.public_disclaimer ? (
                  <p className="text-xs leading-relaxed text-muted-foreground break-anywhere">
                    {view.profiles.public_disclaimer}
                  </p>
                ) : null}
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground text-pretty break-anywhere md:text-base">
                {view.body}
              </p>
              {view.source_urls?.length ? (
                <ul className="flex flex-wrap gap-2">
                  {view.source_urls.map((source) => (
                    <li key={source}>
                      <Button asChild variant="outline" size="sm">
                        <Link href={source} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-4" aria-hidden="true" />
                          Source
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <VoteButtons endpoint={`/api/views/${view.id}/vote`} breakdown={view.voteBreakdown} label="view" />
          </div>
          <details className="rounded-lg border border-border bg-muted/30 p-3">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold">
              <MessageSquarePlus className="size-4" aria-hidden="true" />
              Request follow-up
            </summary>
            <div className="mt-3">
              <FollowUpForm questionId={questionId} targetViewId={view.id} compact />
            </div>
          </details>
          <FlagViewForm viewId={view.id} />
        </Panel>
      ))}
    </div>
  );
}
