"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormStatus } from "@/components/forms/form-status";

export function CandidateQuestionForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        body: form.get("body")
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("Question submitted for the public queue.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Question could not be submitted.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="candidate-title">Question</Label>
        <Input
          id="candidate-title"
          name="title"
          required
          minLength={12}
          maxLength={180}
          placeholder="What should AI builders or policymakers answer this week?"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="candidate-body">Context</Label>
        <Textarea
          id="candidate-body"
          name="body"
          maxLength={2000}
          placeholder="Optional context, constraints, or why this question feels urgent."
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <Send className="size-4" aria-hidden="true" />
          {pending ? "Submitting" : "Submit question"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
