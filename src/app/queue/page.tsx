import { CandidateQuestionForm } from "@/components/forms/candidate-question-form";
import { Kicker } from "@/components/kicker";
import { QueueList } from "@/components/queue-list";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getCandidateQuestions } from "@/lib/data";

export default async function QueuePage() {
  const questions = await getCandidateQuestions(50);

  return (
    <SectionShell>
      <Container className="grid gap-8">
        <div className="rule-double max-w-3xl space-y-3 pt-6">
          <Kicker>Question queue</Kicker>
          <h1 className="type-display text-balance">What should be asked next?</h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            Candidate questions are public inputs for editorial selection. Upvotes and downvotes are stored as
            separate civic and verified institutional signals — and the weekly question is never chosen by votes
            alone.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <Panel className="grid content-start gap-4 xl:sticky xl:top-16 xl:self-start">
            <div className="grid gap-2">
              <Kicker>Propose</Kicker>
              <h2 className="type-title">Submit a candidate question</h2>
            </div>
            <CandidateQuestionForm />
          </Panel>
          <QueueList questions={questions} />
        </div>
      </Container>
    </SectionShell>
  );
}
