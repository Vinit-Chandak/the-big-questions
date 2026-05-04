import { LoginForm } from "@/components/forms/login-form";
import { Badge } from "@/components/ui/badge";
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
      <Container className="grid min-h-[calc(100dvh-8rem)] place-items-center">
        <Panel className="w-full max-w-lg">
          <div className="mb-6 space-y-3">
            <Badge variant="secondary">Magic link</Badge>
            <h1 className="text-3xl font-bold text-balance">Sign in to participate.</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
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
