import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/kicker";
import { Ornament } from "@/components/ornaments";
import { Container, Panel, SectionShell } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Offline"
};

export default function OfflinePage() {
  return (
    <SectionShell>
      <Container className="grid min-h-[calc(100dvh-16rem)] place-items-center">
        <Panel className="grid w-full max-w-lg justify-items-center gap-4 py-10 text-center">
          <Ornament name="bridge" className="h-16 text-muted-foreground/80" />
          <div className="grid justify-items-center gap-2.5">
            <Kicker>Offline</Kicker>
            <h1 className="type-headline text-balance">The hearing is out of reach right now.</h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              You appear to be offline. Reconnect to read this week&apos;s question, the views on the record, and the
              Bridge View.
            </p>
          </div>
          <Button asChild className="mt-1">
            <Link href="/">Try again</Link>
          </Button>
        </Panel>
      </Container>
    </SectionShell>
  );
}
