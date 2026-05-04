import { AuthParticipationPanel } from "@/components/auth-participation-panel";
import { notFound } from "next/navigation";
import { BridgeView } from "@/components/bridge-view";
import { FilterTabs } from "@/components/filter-tabs";
import { FollowUpForm } from "@/components/forms/follow-up-form";
import { ViewComposer } from "@/components/forms/view-composer";
import { FollowUpList } from "@/components/follow-up-list";
import { QuestionCard } from "@/components/question-card";
import { Badge } from "@/components/ui/badge";
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
        <Container className="grid gap-5">
          <QuestionCard question={detail.question} featured />
          <BridgeView bridge={detail.bridge} />
        </Container>
      </SectionShell>

      <SectionShell className="bg-muted/35">
        <Container className="grid gap-6 xl:grid-cols-[minmax(18rem,0.55fr)_minmax(0,1.45fr)]">
          <aside className="grid gap-4 xl:sticky xl:top-28 xl:self-start">
            {viewer.profile ? (
              <>
                <Panel className="grid gap-4">
                  <div>
                    <Badge variant="outline">Write</Badge>
                    <h2 className="mt-2 text-xl font-bold">Add a view</h2>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge variant="secondary">Reading mode</Badge>
                <h2 className="mt-2 text-2xl font-bold">Views</h2>
              </div>
              <FilterTabs questionId={detail.question.id} active={group} />
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
        </Container>
      </SectionShell>
    </>
  );
}
