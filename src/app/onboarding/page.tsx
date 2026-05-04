import Link from "next/link";
import { OnboardingForm } from "@/components/forms/onboarding-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <Container className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(20rem,0.6fr)]">
        <Panel className="grid gap-4">
          <div className="space-y-3">
            <Badge variant="secondary">Profile</Badge>
            <h1 className="text-3xl font-bold text-balance md:text-4xl">Set your public participation profile.</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Admin bootstrap happens here for signed-in emails listed in ADMIN_BOOTSTRAP_EMAILS. Ordinary users cannot
              set their own role or verification status.
            </p>
          </div>
          {viewer.configured ? (
            <OnboardingForm profile={viewer.profile} nextPath={nextPath} />
          ) : (
            <p className="text-sm font-bold text-destructive">Supabase environment variables are not configured.</p>
          )}
        </Panel>
        <Panel className="grid content-start gap-4">
          <Badge variant="outline" className="w-fit">
            Current label
          </Badge>
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">User type</dt>
              <dd className="font-bold">{viewer.profile?.user_type ?? "Not onboarded"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Verification</dt>
              <dd className="font-bold">{viewer.profile?.verification_status ?? "none"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Affiliation</dt>
              <dd className="font-bold break-anywhere">{viewer.profile?.affiliation_org ?? "None"}</dd>
            </div>
          </dl>
          <Button asChild variant="outline">
            <Link href="/verify">Request verification</Link>
          </Button>
        </Panel>
      </Container>
    </SectionShell>
  );
}
