import { EmptyState } from "@/components/empty-state";
import { QuestionCard } from "@/components/question-card";
import type { QuestionWithVotes } from "@/lib/data";

type QueueListProps = {
  questions: QuestionWithVotes[];
};

export function QueueList({ questions }: QueueListProps) {
  if (questions.length === 0) {
    return (
      <EmptyState
        badge="Queue"
        art="scales"
        title="No candidate questions are on the docket yet."
        body="Once signed-in participants submit candidate questions, they appear here for public reading with separate civic and verified institutional vote signals."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}
