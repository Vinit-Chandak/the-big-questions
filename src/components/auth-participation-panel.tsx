import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        <div className="space-y-2">
          <Badge variant="secondary">Sign in required</Badge>
          <h2 className="text-xl font-bold text-balance">Sign in and verify before answering.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Public reading stays open. To answer, request clarification, or vote, sign in first; the flow will take you
            through profile setup and verification.
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
        <div className="space-y-2">
          <Badge variant="secondary">Profile required</Badge>
          <h2 className="text-xl font-bold text-balance">Finish your profile before answering.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your public profile creates the civic label used beside views, follow-ups, votes, and verification requests.
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
      <div className="space-y-2">
        <Badge variant="outline">Verification</Badge>
        <h2 className="text-xl font-bold text-balance">Request verification for institutional labels.</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Civic answers can be posted from your profile. Verified affiliation and official-response labels are reviewed
          separately.
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
