import {
  AdminQuestionForm,
  BridgeEditor,
  PublishQuestionForm,
  VerificationReviewForm
} from "@/components/forms/admin-forms";
import { Kicker } from "@/components/kicker";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getCandidateQuestions, getCurrentQuestion, getViewer } from "@/lib/data";

export default async function AdminPage() {
  const [viewer, queue, currentQuestion] = await Promise.all([
    getViewer(),
    getCandidateQuestions(50),
    getCurrentQuestion()
  ]);
  const isAdmin = viewer.profile?.user_type === "admin";

  return (
    <SectionShell>
      <Container className="grid gap-8">
        <div className="rule-double max-w-3xl space-y-3 pt-6">
          <Kicker>{isAdmin ? "Admin desk" : "Restricted"}</Kicker>
          <h1 className="type-display text-balance">The editor&apos;s desk.</h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            Admin routes enforce profile-based authorization server-side. This desk holds the alpha controls:
            starter and admin questions, weekly publishing, the Bridge View, and verification review.
          </p>
        </div>

        {!isAdmin ? (
          <Panel>
            <p className="text-sm font-semibold text-destructive">
              Admin access is required. Bootstrap the first admin through onboarding with an email listed in
              ADMIN_BOOTSTRAP_EMAILS.
            </p>
          </Panel>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            <Panel className="grid content-start gap-4">
              <div className="grid gap-2 border-b border-border pb-4">
                <Kicker>Compose</Kicker>
                <h2 className="type-title">Create a starter or admin question</h2>
              </div>
              <AdminQuestionForm />
            </Panel>
            <Panel className="grid content-start gap-4">
              <div className="grid gap-2 border-b border-border pb-4">
                <Kicker>Publish</Kicker>
                <h2 className="type-title">Publish the weekly question</h2>
              </div>
              <PublishQuestionForm questions={queue} />
            </Panel>
            <Panel className="grid content-start gap-4">
              <div className="grid gap-2 border-b border-border pb-4">
                <Kicker>Synthesize</Kicker>
                <h2 className="type-title">Bridge View editor</h2>
              </div>
              <BridgeEditor questionId={currentQuestion?.id} />
            </Panel>
            <Panel className="grid content-start gap-4">
              <div className="grid gap-2 border-b border-border pb-4">
                <Kicker>Review</Kicker>
                <h2 className="type-title">Verification review</h2>
              </div>
              <VerificationReviewForm />
            </Panel>
          </div>
        )}
      </Container>
    </SectionShell>
  );
}
