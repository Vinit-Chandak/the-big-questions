import { AuthParticipationPanel } from "@/components/auth-participation-panel";
import { BridgeView } from "@/components/bridge-view";
import { EmptyState } from "@/components/empty-state";
import { FollowUpList } from "@/components/follow-up-list";
import { FollowUpForm } from "@/components/forms/follow-up-form";
import { ViewComposer } from "@/components/forms/view-composer";
import { QuestionCard } from "@/components/question-card";
import { ViewList } from "@/components/view-list";
import { Badge } from "@/components/ui/badge";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getCurrentQuestion, getQuestionDetail, getViewer } from "@/lib/data";

export default async function HomePage() {
  const [viewer, currentQuestion] = await Promise.all([getViewer(), getCurrentQuestion()]);
  const detail = currentQuestion ? await getQuestionDetail(currentQuestion.id, "all") : null;

  return (
    <SectionShell>
      <Container className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="amber">Current hearing</Badge>
          {viewer.configured ? <Badge variant="outline">Public read</Badge> : <Badge variant="muted">Setup needed</Badge>}
        </div>

        {currentQuestion && detail ? (
          <>
            <QuestionCard question={detail.question} featured />
            <BridgeView bridge={detail.bridge} />

            <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.55fr)_minmax(0,1.45fr)]">
              <aside className="grid gap-4 xl:sticky xl:top-28 xl:self-start">
                {viewer.profile ? (
                  <>
                    <Panel className="grid gap-4">
                      <div>
                        <Badge variant="outline">Answer</Badge>
                        <h2 className="mt-2 text-xl font-bold">Add your view</h2>
                      </div>
                      <ViewComposer questionId={detail.question.id} canSubmitOfficial={viewer.canSubmitOfficial} />
                    </Panel>
                    <Panel className="grid gap-4">
                      <div>
                        <Badge variant="outline">Clarify</Badge>
                        <h2 className="mt-2 text-xl font-bold">Question follow-up</h2>
                      </div>
                      <FollowUpForm questionId={detail.question.id} />
                    </Panel>
                    <AuthParticipationPanel profile={viewer.profile} isAuthenticated={viewer.isAuthenticated} />
                  </>
                ) : (
                  <AuthParticipationPanel profile={null} isAuthenticated={viewer.isAuthenticated} next="/verify" />
                )}
              </aside>

              <div className="grid gap-6">
                <div>
                  <Badge variant="secondary">Discussion</Badge>
                  <h2 className="mt-2 text-2xl font-bold">Views</h2>
                </div>
                <ViewList questionId={detail.question.id} views={detail.views} />
                <div className="grid gap-3">
                  <div>
                    <Badge variant="secondary">Clarification</Badge>
                    <h2 className="mt-2 text-2xl font-bold">Follow-ups</h2>
                  </div>
                  <FollowUpList followUps={detail.followUps} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            badge="Current question"
            title="No weekly question is active yet."
            body={
              viewer.configured
                ? "An admin can publish a starter or shortlisted question from the admin console. Public submissions live on the queue page."
                : "Add Supabase environment variables, run the schema migration, then bootstrap the first admin through onboarding."
            }
          />
        )}
      </Container>
    </SectionShell>
  );
}
