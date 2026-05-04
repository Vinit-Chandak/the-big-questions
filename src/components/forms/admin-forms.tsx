"use client";

import { BookOpenCheck, FilePenLine, Send, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/lib/types";

export function AdminQuestionForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        body: form.get("body"),
        origin: form.get("origin"),
        status: form.get("status"),
        selection_note: form.get("selection_note")
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("Question saved.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Question could not be saved.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="admin-question-title">Question</Label>
        <Input id="admin-question-title" name="title" required minLength={12} maxLength={180} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="admin-question-body">Context</Label>
        <Textarea id="admin-question-body" name="body" maxLength={3000} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="admin-question-origin">Origin</Label>
          <select
            id="admin-question-origin"
            name="origin"
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
            defaultValue="admin_created"
          >
            <option value="admin_created">Admin created</option>
            <option value="starter">Starter</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="admin-question-status">Status</Label>
          <select
            id="admin-question-status"
            name="status"
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
            defaultValue="shortlisted"
          >
            <option value="submitted">Submitted</option>
            <option value="shortlisted">Shortlisted</option>
          </select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="admin-selection-note">Selection note</Label>
        <Textarea id="admin-selection-note" name="selection_note" maxLength={1200} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <FilePenLine className="size-4" aria-hidden="true" />
          {pending ? "Saving" : "Create question"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}

export function PublishQuestionForm({ questions }: { questions: Question[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const questionId = String(form.get("question_id") || "");
    const response = await fetch(`/api/admin/questions/${questionId}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selection_note: form.get("selection_note")
      })
    });

    if (response.ok) {
      setTone("success");
      setMessage("Question published.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Question could not be published.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="publish-question">Question</Label>
        <select
          id="publish-question"
          name="question_id"
          required
          className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
        >
          <option value="">Select a shortlisted question</option>
          {questions.map((question) => (
            <option key={question.id} value={question.id}>
              {question.title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="publish-note">Selection note</Label>
        <Textarea id="publish-note" name="selection_note" required minLength={12} maxLength={1200} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <Send className="size-4" aria-hidden="true" />
          {pending ? "Publishing" : "Publish weekly question"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}

export function BridgeEditor({ questionId }: { questionId?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/bridge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: form.get("question_id"),
        strongest_civic_views: form.get("strongest_civic_views"),
        strongest_institutional_views: form.get("strongest_institutional_views"),
        disagreements: form.get("disagreements"),
        unanswered_concerns: form.get("unanswered_concerns"),
        open_follow_ups: form.get("open_follow_ups")
      })
    });

    if (response.ok) {
      setTone("success");
      setMessage("Bridge View saved.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Bridge View could not be saved.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="bridge-question-id">Question ID</Label>
        <Input id="bridge-question-id" name="question_id" required defaultValue={questionId ?? ""} />
      </div>
      {[
        ["strongest_civic_views", "Strongest civic views"],
        ["strongest_institutional_views", "Strongest institutional views"],
        ["disagreements", "Disagreements"],
        ["unanswered_concerns", "Unanswered concerns"],
        ["open_follow_ups", "Open follow-ups"]
      ].map(([name, label]) => (
        <div className="grid gap-2" key={name}>
          <Label htmlFor={`bridge-${name}`}>{label}</Label>
          <Textarea id={`bridge-${name}`} name={name} maxLength={4000} />
        </div>
      ))}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <BookOpenCheck className="size-4" aria-hidden="true" />
          {pending ? "Saving" : "Save Bridge View"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}

export function VerificationReviewForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const requestId = String(form.get("request_id") || "");
    const response = await fetch(`/api/admin/verification/${requestId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: form.get("user_id"),
        approved_status: form.get("approved_status"),
        user_type: form.get("user_type") || undefined,
        affiliation_org: form.get("affiliation_org"),
        affiliation_domain: form.get("affiliation_domain")
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("Verification reviewed.");
      router.refresh();
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Verification review could not be saved.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="review-request-id">Request ID</Label>
          <Input id="review-request-id" name="request_id" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="review-user-id">User ID</Label>
          <Input id="review-user-id" name="user_id" required />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="approved-status">Status</Label>
          <select
            id="approved-status"
            name="approved_status"
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
            defaultValue="verified_affiliation"
          >
            <option value="verified_affiliation">Verified affiliation</option>
            <option value="official_representative">Official representative</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="review-user-type">User type</Label>
          <select
            id="review-user-type"
            name="user_type"
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
            defaultValue="lab"
          >
            <option value="lab">Lab</option>
            <option value="policy">Policy</option>
            <option value="academic">Academic</option>
            <option value="journalist">Journalist</option>
            <option value="civil_society">Civil society</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="review-org">Organization</Label>
          <Input id="review-org" name="affiliation_org" maxLength={140} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="review-domain">Domain</Label>
          <Input id="review-domain" name="affiliation_domain" maxLength={140} />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <ShieldCheck className="size-4" aria-hidden="true" />
          {pending ? "Reviewing" : "Save review"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
