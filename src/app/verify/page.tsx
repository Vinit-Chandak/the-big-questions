import { AuthParticipationPanel } from "@/components/auth-participation-panel";
import { VerificationForm } from "@/components/forms/verification-form";
import { Badge } from "@/components/ui/badge";
import { Kicker } from "@/components/kicker";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getViewer } from "@/lib/data";

export default async function VerifyPage() {
  const viewer = await getViewer();

  return (
    <SectionShell>
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
        <div className="rule-double space-y-4 pt-6">
          <Kicker>Verification</Kicker>
          <h1 className="type-display text-balance">Affiliation is not representation.</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            Verified affiliation confirms a professional or institutional connection — you still speak for yourself.
            Official representative status is reserved for authorized organizational or office responses. Verified
            affiliation alone never implies an employer position.
          </p>

          <div className="max-w-2xl space-y-3 border-l-[3px] border-gold pl-4 sm:pl-5">
            <p className="type-kicker text-muted-foreground">How labels appear on the record</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="civic">Civic user</Badge>
              <Badge variant="institutional">Verified affiliation: Anthropic</Badge>
              <Badge variant="amber">Official response: Office of X</Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Labels sit beside every view, follow-up, and vote breakdown, so readers always know who is speaking and
              in what capacity.
            </p>
          </div>
        </div>

        {viewer.profile ? (
          <Panel className="grid content-start gap-4 lg:sticky lg:top-16 lg:self-start">
            <div className="grid gap-2">
              <Kicker>Request</Kicker>
              <h2 className="type-title">Request verification</h2>
            </div>
            <VerificationForm />
          </Panel>
        ) : (
          <AuthParticipationPanel profile={null} isAuthenticated={viewer.isAuthenticated} next="/verify" />
        )}
      </Container>
    </SectionShell>
  );
}
