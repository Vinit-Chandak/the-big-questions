import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("max-w-full rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5", className)}
      {...props}
    />
  );
}

export function SectionShell({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("w-full border-b border-border", className)} {...props} />;
}

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8", className)} {...props} />;
}
