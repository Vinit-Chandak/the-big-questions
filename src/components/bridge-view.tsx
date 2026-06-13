import { Kicker } from "@/components/kicker";
import { Ornament } from "@/components/ornaments";
import type { BridgeSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type BridgeViewProps = {
  bridge: BridgeSummary | null;
};

const fields: Array<{ key: keyof BridgeSummary; label: string; edge: string }> = [
  { key: "strongest_civic_views", label: "Strongest civic concerns", edge: "border-l-civic" },
  { key: "strongest_institutional_views", label: "Strongest institutional views", edge: "border-l-institutional" },
  { key: "disagreements", label: "Points of disagreement", edge: "border-l-gold" },
  { key: "unanswered_concerns", label: "Unanswered concerns", edge: "border-l-border" },
  { key: "open_follow_ups", label: "Open follow-ups", edge: "border-l-border" }
];

export function BridgeView({ bridge }: BridgeViewProps) {
  if (!bridge) {
    return (
      <section className="rule-ink grid justify-items-start gap-3 pt-5">
        <Kicker>Bridge view</Kicker>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Ornament name="bridge" className="h-14 text-muted-foreground/80" />
          <div className="max-w-xl">
            <h2 className="type-title text-balance">The synthesis has not been written yet.</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              Once civic views, institutional views, and follow-ups reveal the shape of this hearing, a neutral
              summary of agreements, disagreements, and open questions will appear here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rule-ink grid gap-5 pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="grid gap-2">
          <Kicker>Bridge view</Kicker>
          <h2 className="type-headline">Where the hearing stands</h2>
        </div>
        <p className="type-meta max-w-xs text-muted-foreground">
          A neutral synthesis of both sides — strongest views, friction, and what remains unanswered.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => {
          const value = bridge[field.key];
          const text = typeof value === "string" && value.trim() ? value : null;
          return (
            <section
              key={field.key}
              className={cn("rounded-md border border-border border-l-[3px] bg-card p-4", field.edge)}
            >
              <h3 className="type-kicker text-foreground/80">{field.label}</h3>
              {text ? (
                <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground break-anywhere">
                  {text}
                </p>
              ) : (
                <p className="mt-2.5 text-sm italic leading-relaxed text-muted-foreground/70">Not yet summarized.</p>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
