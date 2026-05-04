import { BookOpenCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { BridgeSummary } from "@/lib/types";

type BridgeViewProps = {
  bridge: BridgeSummary | null;
};

const fields: Array<[keyof BridgeSummary, string]> = [
  ["strongest_civic_views", "Civic views"],
  ["strongest_institutional_views", "Institutional views"],
  ["disagreements", "Disagreements"],
  ["unanswered_concerns", "Unanswered concerns"],
  ["open_follow_ups", "Open follow-ups"]
];

export function BridgeView({ bridge }: BridgeViewProps) {
  if (!bridge) {
    return (
      <Panel className="grid gap-3">
        <Badge variant="muted" className="w-fit">
          Bridge View
        </Badge>
        <h2 className="text-xl font-bold text-balance">No Bridge View has been published for this question.</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Admins can add a neutral synthesis after civic views, verified institutional views, and follow-ups begin to
          reveal the shape of the hearing.
        </p>
      </Panel>
    );
  }

  return (
    <Panel className="grid gap-5">
      <div className="flex items-center gap-2">
        <BookOpenCheck className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-bold">Bridge View</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {fields.map(([key, label]) => (
          <section key={key} className="rounded-lg border border-border bg-background p-3">
            <h3 className="text-sm font-bold">{label}</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground break-anywhere">
              {String(bridge[key] || "Not yet summarized.")}
            </p>
          </section>
        ))}
      </div>
    </Panel>
  );
}
