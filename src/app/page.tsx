import { AuthParticipationPanel } from "@/components/auth-participation-panel";
import { BridgeView } from "@/components/bridge-view";
import { EmptyState } from "@/components/empty-state";
import { FollowUpList } from "@/components/follow-up-list";
import { FollowUpForm } from "@/components/forms/follow-up-form";
import { ViewComposer } from "@/components/forms/view-composer";
import { Kicker } from "@/components/kicker";
import { QuestionCard } from "@/components/question-card";
import { ViewList } from "@/components/view-list";
import { Badge } from "@/components/ui/badge";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getCurrentQuestion, getQuestionDetail, getViewer } from "@/lib/data";

export default async function HomePage() {
  const [viewer, currentQuestion] = await Promise.all([getViewer(), getCurrentQuestion()]);
  const detail = currentQuestion ? await getQuestionDetail(currentQuestion.id, "all") : null;
  const activeDetail = currentQuestion && detail ? detail : null;

  return (
    <>
      <SectionShell>
        <Container className="grid gap-8">
          {!viewer.configured ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">Setup needed</Badge>
            </div>
          ) : null}

          {activeDetail ? (
            <>
              <QuestionCard question={activeDetail.question} featured />
              <BridgeView bridge={activeDetail.bridge} />
            </>
          ) : (
            <EmptyState
              badge="Current question"
              art="forum"
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

      {activeDetail ? (
        <SectionShell className="border-t border-border bg-muted/35">
          <Container className="grid gap-8 xl:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
            <aside className="grid content-start gap-4 xl:sticky xl:top-16 xl:self-start">
              {viewer.profile ? (
                <>
                  <Panel className="grid gap-4">
                    <div className="grid gap-2">
                      <Kicker>Answer</Kicker>
                      <h2 className="type-title">Add your view to the record</h2>
                    </div>
                    <ViewComposer questionId={activeDetail.question.id} canSubmitOfficial={viewer.canSubmitOfficial} />
                  </Panel>
                  <Panel className="grid gap-4">
                    <div className="grid gap-2">
                      <Kicker>Clarify</Kicker>
                      <h2 className="type-title">Ask about the question</h2>
                    </div>
                    <FollowUpForm questionId={activeDetail.question.id} />
                  </Panel>
                  <AuthParticipationPanel profile={viewer.profile} isAuthenticated={viewer.isAuthenticated} />
                </>
              ) : (
                <AuthParticipationPanel profile={null} isAuthenticated={viewer.isAuthenticated} next="/verify" />
              )}
            </aside>

            <div className="grid content-start gap-8">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Kicker>The record</Kicker>
                  <h2 className="type-headline">Views</h2>
                </div>
                <ViewList questionId={activeDetail.question.id} views={activeDetail.views} />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Kicker>Clarification docket</Kicker>
                  <h2 className="type-headline">Follow-ups</h2>
                </div>
                <FollowUpList followUps={activeDetail.followUps} />
              </div>
            </div>
          </Container>
        </SectionShell>
      ) : null}
    </>
  );
}
