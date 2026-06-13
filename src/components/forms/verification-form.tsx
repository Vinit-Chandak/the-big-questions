"use client";

import { ShieldPlus } from "lucide-react";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function VerificationForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/verification/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requested_status: form.get("requested_status"),
        affiliation_org: form.get("affiliation_org"),
        evidence_url: form.get("evidence_url"),
        evidence_email_domain: form.get("evidence_email_domain"),
        notes: form.get("notes")
      })
    });

    if (response.ok) {
      event.currentTarget.reset();
      setTone("success");
      setMessage("Verification request submitted.");
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Verification request could not be submitted.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="requested-status">Request type</Label>
        <select
          id="requested-status"
          name="requested_status"
          className="min-h-11 rounded-sm border border-input bg-background px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 md:min-h-10 md:text-sm"
          defaultValue="verified_affiliation"
        >
          <option value="verified_affiliation">Verified affiliation</option>
          <option value="official_representative">Official representative</option>
        </select>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="affiliation-org">Organization</Label>
          <Input id="affiliation-org" name="affiliation_org" required minLength={2} maxLength={140} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="evidence-domain">Email domain</Label>
          <Input id="evidence-domain" name="evidence_email_domain" maxLength={140} placeholder="example.org" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="evidence-url">Evidence URL</Label>
        <Input id="evidence-url" name="evidence_url" type="url" maxLength={500} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="verification-notes">Notes</Label>
        <Textarea id="verification-notes" name="notes" maxLength={2000} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <ShieldPlus className="size-4" aria-hidden="true" />
          {pending ? "Submitting" : "Request verification"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
