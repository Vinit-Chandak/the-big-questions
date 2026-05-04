"use client";

import { Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FollowUpReplyFormProps = {
  followUpId: string;
};

export function FollowUpReplyForm({ followUpId }: FollowUpReplyFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/follow-ups/${followUpId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: form.get("body")
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("Reply posted.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Reply could not be posted.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor={`reply-${followUpId}`}>Reply</Label>
        <Textarea id={`reply-${followUpId}`} name="body" required minLength={4} maxLength={3000} className="min-h-24" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-auto">
          <Reply className="size-4" aria-hidden="true" />
          {pending ? "Posting" : "Post reply"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
