"use client";

import { UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "@/lib/types";

type OnboardingFormProps = {
  profile: Profile | null;
  nextPath?: string;
};

export function OnboardingForm({ profile, nextPath }: OnboardingFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: form.get("display_name"),
        public_disclaimer: form.get("public_disclaimer")
      })
    });

    if (response.ok) {
      setTone("success");
      setMessage("Profile saved.");
      if (nextPath) {
        router.push(nextPath);
      } else {
        router.refresh();
      }
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Profile could not be saved.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          name="display_name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={profile?.display_name ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="public-disclaimer">Public disclaimer</Label>
        <Textarea
          id="public-disclaimer"
          name="public_disclaimer"
          maxLength={500}
          defaultValue={profile?.public_disclaimer ?? ""}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <UserCheck className="size-4" aria-hidden="true" />
          {pending ? "Saving" : "Save profile"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
