import { CandidateQuestionForm } from "@/components/forms/candidate-question-form";
import { QueueList } from "@/components/queue-list";
import { Badge } from "@/components/ui/badge";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getCandidateQuestions } from "@/lib/data";

export default async function QueuePage() {
  const questions = await getCandidateQuestions(50);

  return (
    <SectionShell>
      <Container className="grid gap-6">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Candidate queue</Badge>
          <h1 className="text-3xl font-bold text-balance md:text-4xl">Submitted questions with separate vote signals.</h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Candidate questions are public inputs for editorial selection. Upvotes and downvotes are stored as separate
            civic and verified institutional signals.
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(20rem,0.55fr)_minmax(0,1.45fr)]">
          <Panel className="grid gap-4 xl:sticky xl:top-28 xl:self-start">
            <h2 className="text-xl font-bold">Submit candidate question</h2>
            <CandidateQuestionForm />
          </Panel>
          <QueueList questions={questions} />
        </div>
      </Container>
    </SectionShell>
  );
}
