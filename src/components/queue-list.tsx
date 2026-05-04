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
        title="No candidate questions are visible yet."
        body="Once signed-in users submit candidate questions, they will appear here for public reading and separate civic and verified vote signals."
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
