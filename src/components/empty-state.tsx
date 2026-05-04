import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

type EmptyStateProps = {
  title: string;
  body: string;
  badge?: string;
};

export function EmptyState({ title, body, badge = "Empty" }: EmptyStateProps) {
  return (
    <Panel className="flex min-h-40 flex-col justify-between gap-4">
      <Badge variant="muted" className="w-fit">
        {badge}
      </Badge>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-balance">{title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">{body}</p>
      </div>
    </Panel>
  );
}
