import Link from "next/link";
import { OnboardingForm } from "@/components/forms/onboarding-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/kicker";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { getViewer } from "@/lib/data";
import { safeRedirectPath } from "@/lib/redirects";

type OnboardingPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const query = await searchParams;
  const nextPath = query.next ? safeRedirectPath(query.next, "/verify") : undefined;
  const viewer = await getViewer();

  return (
    <SectionShell>
      <Container className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <Panel className="grid content-start gap-5 p-6 sm:p-8">
          <div className="space-y-3">
            <Kicker>Profile</Kicker>
            <h1 className="type-headline text-balance">Set your public participation profile.</h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              Your display name and optional disclaimer appear beside everything you put on the record. Admin
              bootstrap happens here for signed-in emails listed in ADMIN_BOOTSTRAP_EMAILS; ordinary users cannot set
              their own role or verification status.
            </p>
          </div>
          {viewer.configured ? (
            <OnboardingForm profile={viewer.profile} nextPath={nextPath} />
          ) : (
            <p className="text-sm font-semibold text-destructive">Supabase environment variables are not configured.</p>
          )}
        </Panel>

        <Panel className="grid content-start gap-4 lg:sticky lg:top-16 lg:self-start">
          <div className="grid gap-2">
            <Kicker>Credential</Kicker>
            <h2 className="type-title">Your current label</h2>
          </div>
          <dl className="grid gap-3 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">User type</dt>
              <dd className="font-semibold">{viewer.profile?.user_type ?? "Not onboarded"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Verification</dt>
              <dd className="font-semibold">{viewer.profile?.verification_status ?? "none"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Affiliation</dt>
              <dd className="font-semibold break-anywhere">{viewer.profile?.affiliation_org ?? "None"}</dd>
            </div>
          </dl>
          {viewer.profile ? (
            <div className="border-t border-border pt-4">
              <Badge variant={viewer.profile.user_type === "admin" ? "amber" : "civic"}>
                {viewer.profile.user_type === "admin" ? "Admin" : "Civic participant"}
              </Badge>
            </div>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/verify">Request verification</Link>
          </Button>
        </Panel>
      </Container>
    </SectionShell>
  );
}
