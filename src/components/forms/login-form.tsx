"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error">("success");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), next: nextPath })
    });

    if (response.ok) {
      setTone("success");
      setMessage("Magic link sent. Check your email.");
    } else {
      const payload = await response.json().catch(() => null);
      setTone("error");
      setMessage(payload?.error?.message || "Magic link could not be sent.");
    }

    setPending(false);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          <Mail className="size-4" aria-hidden="true" />
          {pending ? "Sending" : "Send magic link"}
        </Button>
        <FormStatus message={message} tone={tone} />
      </div>
    </form>
  );
}
