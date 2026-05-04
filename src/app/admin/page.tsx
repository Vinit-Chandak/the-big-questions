import {
  AdminQuestionForm,
  BridgeEditor,
  PublishQuestionForm,
  VerificationReviewForm
} from "@/components/forms/admin-forms";
import { Badge } from "@/components/ui/badge";
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
      <Container className="grid gap-6">
        <div className="max-w-3xl space-y-3">
          <Badge variant={isAdmin ? "default" : "muted"}>{isAdmin ? "Admin" : "Restricted"}</Badge>
          <h1 className="text-3xl font-bold text-balance md:text-4xl">Admin review and publishing console.</h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Admin routes enforce profile-based authorization server-side. This console exposes alpha controls for
            starter/admin questions, weekly publishing, Bridge View editing, and verification review.
          </p>
        </div>

        {!isAdmin ? (
          <Panel>
            <p className="text-sm font-bold text-destructive">
              Admin access is required. Bootstrap the first admin through onboarding with an email listed in
              ADMIN_BOOTSTRAP_EMAILS.
            </p>
          </Panel>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            <Panel className="grid gap-4">
              <h2 className="text-xl font-bold">Create starter or admin question</h2>
              <AdminQuestionForm />
            </Panel>
            <Panel className="grid gap-4">
              <h2 className="text-xl font-bold">Publish weekly question</h2>
              <PublishQuestionForm questions={queue} />
            </Panel>
            <Panel className="grid gap-4">
              <h2 className="text-xl font-bold">Bridge View editor</h2>
              <BridgeEditor questionId={currentQuestion?.id} />
            </Panel>
            <Panel className="grid gap-4">
              <h2 className="text-xl font-bold">Verification review</h2>
              <VerificationReviewForm />
            </Panel>
          </div>
        )}
      </Container>
    </SectionShell>
  );
}
