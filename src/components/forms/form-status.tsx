"use client";

import { cn } from "@/lib/utils";

type FormStatusProps = {
  message: string | null;
  tone?: "neutral" | "success" | "error";
};

export function FormStatus({ message, tone = "neutral" }: FormStatusProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-sm font-semibold leading-relaxed",
        tone === "success" && "text-primary",
        tone === "error" && "text-destructive",
        tone === "neutral" && "text-muted-foreground"
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}
