import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/kicker";
import { Panel } from "@/components/ui/panel";
import { loginPath } from "@/lib/redirects";
import type { Profile } from "@/lib/types";

type AuthParticipationPanelProps = {
  profile: Profile | null;
  isAuthenticated?: boolean;
  next?: string;
};

export function AuthParticipationPanel({ profile, isAuthenticated = false, next = "/verify" }: AuthParticipationPanelProps) {
  if (!profile && !isAuthenticated) {
    return (
      <Panel className="grid gap-4">
        <div className="space-y-2.5">
          <Kicker>Take part</Kicker>
          <h2 className="type-title text-balance">Sign in to go on the record.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            Reading stays open to everyone. To write a view, request clarification, or vote, sign in first — the flow
            walks you through profile setup and optional verification.
          </p>
        </div>
        <Button asChild className="w-full sm:w-fit">
          <Link href={loginPath(next)}>
            <LogIn className="size-4" aria-hidden="true" />
            Sign in to answer
          </Link>
        </Button>
      </Panel>
    );
  }

  if (!profile && isAuthenticated) {
    return (
      <Panel className="grid gap-4">
        <div className="space-y-2.5">
          <Kicker>Almost there</Kicker>
          <h2 className="type-title text-balance">Finish your profile before answering.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            Your public profile creates the civic label shown beside your views, follow-ups, and votes.
          </p>
        </div>
        <Button asChild className="w-full sm:w-fit">
          <Link href={`/onboarding?next=${encodeURIComponent(next)}`}>
            <LogIn className="size-4" aria-hidden="true" />
            Finish profile
          </Link>
        </Button>
      </Panel>
    );
  }

  return (
    <Panel className="grid gap-4">
      <div className="space-y-2.5">
        <Kicker>Verification</Kicker>
        <h2 className="type-title text-balance">Speak with an institutional label.</h2>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          Civic views post straight from your profile. Verified affiliation and official-response labels are reviewed
          separately, and personal views are never presented as employer positions.
        </p>
      </div>
      <Button asChild variant="outline" className="w-full sm:w-fit">
        <Link href="/verify">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Request verification
        </Link>
      </Button>
    </Panel>
  );
}
