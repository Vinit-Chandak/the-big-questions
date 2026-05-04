import Link from "next/link";
import { CalendarClock, FileQuestion, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { VoteButtons } from "@/components/vote-buttons";
import type { QuestionWithVotes } from "@/lib/data";

type QuestionCardProps = {
  question: QuestionWithVotes;
  featured?: boolean;
};

export function QuestionCard({ question, featured = false }: QuestionCardProps) {
  return (
    <Panel className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={question.status === "active" ? "default" : "secondary"}>{question.status}</Badge>
            <Badge variant="outline">{question.origin.replace("_", " ")}</Badge>
          </div>
          <div className="space-y-2">
            <h2 className={featured ? "text-2xl font-bold text-balance md:text-4xl" : "text-xl font-bold text-balance"}>
              {question.title}
            </h2>
            {question.body ? (
              <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
                {question.body}
              </p>
            ) : null}
          </div>
        </div>
        <VoteButtons
          endpoint={`/api/questions/${question.id}/vote`}
          breakdown={question.voteBreakdown}
          label="question"
        />
      </div>

      {question.selection_note ? (
        <div className="grid gap-2 rounded-lg border border-border bg-muted/45 p-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Selection note
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{question.selection_note}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {question.published_at ? (
            <CalendarClock className="size-4" aria-hidden="true" />
          ) : (
            <FileQuestion className="size-4" aria-hidden="true" />
          )}
          <span>{question.published_at ? "Published" : "Queued"}</span>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/questions/${question.id}`}>Open question</Link>
        </Button>
      </div>
    </Panel>
  );
}
