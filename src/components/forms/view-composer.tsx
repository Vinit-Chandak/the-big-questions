"use client";

import { PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ViewPosition } from "@/lib/types";

type ViewComposerProps = {
  questionId: string;
  canSubmitOfficial: boolean;
};

export function ViewComposer({ questionId, canSubmitOfficial }: ViewComposerProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const rawUrls = String(form.get("source_urls") || "")
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);

    const response = await fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        body: form.get("body"),
        position: form.get("position") as ViewPosition,
        source_urls: rawUrls
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("View posted.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "View could not be posted.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="view-body">Your view</Label>
        <Textarea
          id="view-body"
          name="body"
          required
          minLength={20}
          maxLength={8000}
          placeholder="Write it in your own words — no prompts, no template."
        />
      </div>
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="view-sources">Source links</Label>
          <Textarea
            id="view-sources"
            name="source_urls"
            className="min-h-24"
            placeholder="One URL per line"
          />
        </div>
        <div className="grid content-start gap-2">
          <Label htmlFor="view-position">Label</Label>
          <select
            id="view-position"
            name="position"
            className="min-h-11 rounded-sm border border-input bg-background px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 md:min-h-10 md:text-sm"
            defaultValue={canSubmitOfficial ? "personal_view" : "unspecified"}
          >
            <option value="unspecified">View</option>
            <option value="personal_view">Personal view</option>
            {canSubmitOfficial ? <option value="official_response">Official response</option> : null}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <PenLine className="size-4" aria-hidden="true" />
          {pending ? "Posting" : "Post view"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
