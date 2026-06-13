import { AuthParticipationPanel } from "@/components/auth-participation-panel";
import { notFound } from "next/navigation";
import { BridgeView } from "@/components/bridge-view";
import { FilterTabs } from "@/components/filter-tabs";
import { FollowUpForm } from "@/components/forms/follow-up-form";
import { ViewComposer } from "@/components/forms/view-composer";
import { FollowUpList } from "@/components/follow-up-list";
import { Kicker } from "@/components/kicker";
import { QuestionCard } from "@/components/question-card";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { ViewList } from "@/components/view-list";
import { getQuestionDetail, getViewer } from "@/lib/data";
import type { AuthorGroup } from "@/lib/types";

const authorGroups = new Set(["all", "civic", "institutional"]);

type QuestionPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ group?: string }>;
};

export default async function QuestionPage({ params, searchParams }: QuestionPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const group = authorGroups.has(query.group || "") ? (query.group as AuthorGroup) : "all";
  const [viewer, detail] = await Promise.all([getViewer(), getQuestionDetail(id, group)]);

  if (!detail) {
    notFound();
  }

  return (
    <>
      <SectionShell>
        <Container className="grid gap-8">
          <QuestionCard question={detail.question} featured />
          <BridgeView bridge={detail.bridge} />
        </Container>
      </SectionShell>

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
                  <ViewComposer questionId={detail.question.id} canSubmitOfficial={viewer.canSubmitOfficial} />
                </Panel>
                <Panel className="grid gap-4">
                  <div className="grid gap-2">
                    <Kicker>Clarify</Kicker>
                    <h2 className="type-title">Ask about the question</h2>
                  </div>
                  <FollowUpForm questionId={detail.question.id} />
                </Panel>
                <AuthParticipationPanel profile={viewer.profile} isAuthenticated={viewer.isAuthenticated} />
              </>
            ) : (
              <AuthParticipationPanel profile={null} isAuthenticated={viewer.isAuthenticated} next="/verify" />
            )}
          </aside>

          <div className="grid content-start gap-8">
            <div className="grid gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid shrink-0 gap-2">
                  <Kicker className="whitespace-nowrap">The record</Kicker>
                  <h2 className="type-headline">Views</h2>
                </div>
                <div className="min-w-0 lg:max-w-[60%]">
                  <FilterTabs questionId={detail.question.id} active={group} />
                </div>
              </div>
              <ViewList questionId={detail.question.id} views={detail.views} />
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Kicker>Clarification docket</Kicker>
                <h2 className="type-headline">Follow-ups</h2>
              </div>
              <FollowUpList followUps={detail.followUps} />
            </div>
          </div>
        </Container>
      </SectionShell>
    </>
  );
}
