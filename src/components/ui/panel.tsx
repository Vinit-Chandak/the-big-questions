import * as React from "react";
import { cn } from "@/lib/utils";

/** A sheet of paper: hairline border, card surface, no heavy shadow. */
export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("max-w-full rounded-md border border-border bg-card p-4 text-card-foreground sm:p-6", className)}
      {...props}
    />
  );
}

export function SectionShell({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("w-full", className)} {...props} />;
}

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[76rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-10", className)} {...props} />;
}
