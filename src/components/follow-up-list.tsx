import { Badge } from "@/components/ui/badge";
import { Kicker } from "@/components/kicker";
import { Ornament } from "@/components/ornaments";
import { Panel } from "@/components/ui/panel";
import { StatusStamp } from "@/components/status-stamp";
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
      <Panel className="grid justify-items-center gap-4 py-10 text-center">
        <Ornament name="scales" className="h-14 text-muted-foreground/80" />
        <div className="grid max-w-md justify-items-center gap-2">
          <Kicker>Follow-ups</Kicker>
          <h2 className="type-title text-balance">No clarification requests yet.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            Follow-ups attach to the question or to a specific view, and are voted on separately — so vague answers
            can be challenged without starting a debate thread.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4">
      {followUps.map((followUp) => (
        <Panel key={followUp.id} className="grid gap-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusStamp status={followUp.status} />
                <Badge variant="muted">{followUp.target_view_id ? "On a view" : "On the question"}</Badge>
              </div>
              <h3 className="text-base font-semibold break-anywhere">
                {followUp.profiles?.display_name || "Unknown requester"}
                <span className="ml-2 font-normal text-muted-foreground">asks</span>
              </h3>
              <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-foreground text-pretty break-anywhere">
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
            <div className="grid gap-3 border-l-2 border-border pl-4 sm:pl-5">
              {followUp.follow_up_replies.map((reply) => (
                <div key={reply.id}>
                  <p className="text-sm font-semibold break-anywhere">
                    {reply.profiles?.display_name || "Unknown author"}
                    <span className="ml-2 font-normal text-muted-foreground">replies</span>
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground break-anywhere">
                    {reply.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="border-t border-border pt-4">
            <FollowUpReplyForm followUpId={followUp.id} />
          </div>
        </Panel>
      ))}
    </div>
  );
}
