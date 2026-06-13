import { Kicker } from "@/components/kicker";
import { Ornament, type OrnamentName } from "@/components/ornaments";
import { Panel } from "@/components/ui/panel";

type EmptyStateProps = {
  title: string;
  body: string;
  badge?: string;
  art?: OrnamentName;
};

export function EmptyState({ title, body, badge = "Empty", art = "forum" }: EmptyStateProps) {
  return (
    <Panel className="grid justify-items-center gap-4 py-10 text-center sm:py-14">
      <Ornament name={art} className="h-16 text-muted-foreground/80" />
      <div className="grid max-w-xl justify-items-center gap-2.5">
        <Kicker>{badge}</Kicker>
        <h2 className="type-title text-balance">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{body}</p>
      </div>
    </Panel>
  );
}
