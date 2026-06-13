import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/forms/login-form";
import { Kicker } from "@/components/kicker";
import { Container, Panel, SectionShell } from "@/components/ui/panel";
import { safeRedirectPath } from "@/lib/redirects";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const nextPath = safeRedirectPath(query.next, "/onboarding");

  return (
    <SectionShell>
      <Container className="grid min-h-[calc(100dvh-16rem)] place-items-center">
        <Panel className="w-full max-w-lg p-6 sm:p-8">
          <div className="mb-6 space-y-3">
            <BrandMark className="size-10 text-ink" />
            <Kicker>Magic link</Kicker>
            <h1 className="type-headline text-balance">Sign in to go on the record.</h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              Public reading does not require an account. Submitting, voting, follow-ups, verification, and admin work
              require sign-in.
            </p>
          </div>
          <LoginForm nextPath={nextPath} />
        </Panel>
      </Container>
    </SectionShell>
  );
}
