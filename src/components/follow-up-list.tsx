import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { VoteButtons } from "@/components/vote-buttons";
import { FollowUpReplyForm } from "@/components/forms/follow-up-reply-form";
import type { FollowUpRequest } from "@/lib/types";
import type { VoteBreakdown } from "@/lib/votes";

type FollowUpWithBreakdown = FollowUpRequest & {
  voteBreakdown: VoteBreakdown;
};

type FollowUpListProps = {
  followUps: FollowUpWithBreakdown[];
};

export function FollowUpList({ followUps }: FollowUpListProps) {
  if (followUps.length === 0) {
    return (
      <Panel className="grid gap-3">
        <Badge variant="muted" className="w-fit">
          Follow-ups
        </Badge>
        <h2 className="text-xl font-bold text-balance">No clarification requests yet.</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Follow-ups can attach to the question or a specific view, then be voted on separately from the main response.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4">
      {followUps.map((followUp) => (
        <Panel key={followUp.id} className="grid gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={followUp.status === "open" ? "default" : "outline"}>{followUp.status}</Badge>
                <Badge variant="muted">{followUp.target_view_id ? "View follow-up" : "Question follow-up"}</Badge>
              </div>
              <h3 className="text-lg font-bold break-anywhere">{followUp.profiles?.display_name || "Unknown requester"}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground break-anywhere md:text-base">
                {followUp.body}
              </p>
            </div>
            <VoteButtons
              endpoint={`/api/follow-ups/${followUp.id}/vote`}
              breakdown={followUp.voteBreakdown}
              label="follow-up"
            />
          </div>

          {followUp.follow_up_replies?.length ? (
            <div className="grid gap-3">
              {followUp.follow_up_replies.map((reply) => (
                <div key={reply.id} className="rounded-lg border border-border bg-background p-3">
                  <p className="text-sm font-bold">{reply.profiles?.display_name || "Unknown author"}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground break-anywhere">
                    {reply.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <FollowUpReplyForm followUpId={followUp.id} />
        </Panel>
      ))}
    </div>
  );
}
