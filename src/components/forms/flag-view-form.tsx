"use client";

import { Flag } from "lucide-react";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FlagViewFormProps = {
  viewId: string;
};

export function FlagViewForm({ viewId }: FlagViewFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/views/${viewId}/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: form.get("reason")
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("Flag submitted for review.");
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Flag could not be submitted.");
    }

    setPending(false);
  }

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <Flag className="size-4" aria-hidden="true" />
        Flag for moderation
        <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span>
      </summary>
      <form className="mt-3 grid gap-3 rounded-md border border-border bg-muted/40 p-3 sm:p-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor={`flag-${viewId}`}>Reason</Label>
          <Textarea id={`flag-${viewId}`} name="reason" required minLength={4} maxLength={1000} className="min-h-24" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-auto">
            <Flag className="size-4" aria-hidden="true" />
            {pending ? "Submitting" : "Submit flag"}
          </Button>
          <FormStatus message={message} tone={tone} />
        </div>
      </form>
    </details>
  );
}
