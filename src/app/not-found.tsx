import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Panel, SectionShell } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <SectionShell>
      <Container className="grid min-h-[calc(100dvh-8rem)] place-items-center">
        <Panel className="w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold">Not found</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">This page or question is not available.</p>
          <Button asChild className="mt-5">
            <Link href="/">Return home</Link>
          </Button>
        </Panel>
      </Container>
    </SectionShell>
  );
}
