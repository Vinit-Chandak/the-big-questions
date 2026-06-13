import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Kicker } from "@/components/kicker";
import { VoteButtons } from "@/components/vote-buttons";
import type { QuestionWithVotes } from "@/lib/data";
import type { QuestionStatus } from "@/lib/types";

type QuestionCardProps = {
  question: QuestionWithVotes;
  featured?: boolean;
};

const statusVariant: Record<QuestionStatus, "default" | "secondary" | "outline" | "amber" | "muted"> = {
  active: "amber",
  shortlisted: "default",
  submitted: "outline",
  archived: "muted",
  rejected: "muted"
};

function originLabel(origin: string) {
  return origin.replaceAll("_", " ");
}

function formatDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(parsed);
}

export function QuestionCard({ question, featured = false }: QuestionCardProps) {
  const published = formatDate(question.published_at);

  if (featured) {
    return (
      <article className="rule-double grid gap-6 pt-6">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Kicker>{published ? `Hearing of ${published}` : "Hearing in preparation"}</Kicker>
            <Badge variant={statusVariant[question.status]}>{question.status}</Badge>
            <Badge variant="outline">{originLabel(question.origin)}</Badge>
          </div>
          <h2 className="type-display max-w-4xl text-balance">{question.title}</h2>
          {question.body ? (
            <p className="type-serif-body max-w-3xl whitespace-pre-line text-pretty text-foreground/85">
              {question.body}
            </p>
          ) : null}
        </div>

        {question.selection_note ? (
          <div className="max-w-3xl border-l-[3px] border-gold pl-4 sm:pl-5">
            <p className="type-kicker text-muted-foreground">Why this question was selected</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground text-pretty">
              {question.selection_note}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-5 border-t border-border pt-5 lg:flex-row lg:items-start lg:justify-between">
          <VoteButtons
            endpoint={`/api/questions/${question.id}/vote`}
            breakdown={question.voteBreakdown}
            label="question"
          />
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/questions/${question.id}`}>
              Open the full hearing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </article>
    );
  }

  return (
    <Panel className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant[question.status]}>{question.status}</Badge>
        <Badge variant="outline">{originLabel(question.origin)}</Badge>
        {published ? <span className="type-meta text-muted-foreground">Published {published}</span> : null}
      </div>

      <div className="grid gap-2">
        <h3 className="type-title text-balance">
          <Link
            href={`/questions/${question.id}`}
            className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {question.title}
          </Link>
        </h3>
        {question.body ? (
          <p className="line-clamp-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground text-pretty">
            {question.body}
          </p>
        ) : null}
      </div>

      {question.selection_note ? (
        <div className="border-l-[3px] border-gold pl-3">
          <p className="type-kicker text-muted-foreground">Selection note</p>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {question.selection_note}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-start sm:justify-between">
        <VoteButtons
          endpoint={`/api/questions/${question.id}/vote`}
          breakdown={question.voteBreakdown}
          label="question"
        />
        <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto">
          <Link href={`/questions/${question.id}`}>
            Open question
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}
