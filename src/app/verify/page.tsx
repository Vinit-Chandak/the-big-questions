import { AuthParticipationPanel } from "@/components/auth-participation-panel";
import { VerificationForm } from "@/components/forms/verification-form";
import { Badge } from "@/components/ui/badge";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getViewer } from "@/lib/data";

export default async function VerifyPage() {
  const viewer = await getViewer();

  return (
    <SectionShell>
      <Container className="grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(20rem,0.65fr)]">
        <div className="space-y-4">
          <Badge variant="secondary">Verification</Badge>
          <h1 className="text-3xl font-bold text-balance md:text-4xl">
            Distinguish affiliation from official representation.
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Verified affiliation confirms a professional or institutional connection. Official representative status is
            reserved for authorized organizational or office responses. Verified affiliation alone does not imply an
            employer position.
          </p>
        </div>
        {viewer.profile ? (
          <Panel>
            <VerificationForm />
          </Panel>
        ) : (
          <AuthParticipationPanel profile={null} isAuthenticated={viewer.isAuthenticated} next="/verify" />
        )}
      </Container>
    </SectionShell>
  );
}
