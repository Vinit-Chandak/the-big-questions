"use client";

import { MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FollowUpFormProps = {
  questionId: string;
  targetViewId?: string;
  compact?: boolean;
};

export function FollowUpForm({ questionId, targetViewId, compact = false }: FollowUpFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/follow-ups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        target_view_id: targetViewId ?? null,
        body: form.get("body")
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("Follow-up requested.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Follow-up could not be requested.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor={targetViewId ? `follow-up-${targetViewId}` : "follow-up-question"}>
          Follow-up
        </Label>
        <Textarea
          id={targetViewId ? `follow-up-${targetViewId}` : "follow-up-question"}
          name="body"
          required
          minLength={8}
          maxLength={700}
          className={compact ? "min-h-24" : undefined}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-auto">
          <MessageSquarePlus className="size-4" aria-hidden="true" />
          {pending ? "Requesting" : "Request clarification"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
