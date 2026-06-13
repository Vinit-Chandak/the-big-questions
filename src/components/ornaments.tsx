import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * Engraved-style line ornaments used in empty states and section breaks.
 * These are hand-drawn placeholders in the spirit of the final etched
 * artwork; each one can be swapped for a generated image with the same
 * footprint (class "engraving" handles dark-mode adaptation for images).
 */

type OrnamentProps = React.SVGProps<SVGSVGElement>;

function base(className?: string) {
  return cn("h-16 w-auto text-foreground/65", className);
}

/** An amphitheater awaiting speakers. */
export function OrnamentForum({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={base(className)} {...props}>
      <path d="M20 58a50 50 0 0 1 100 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 58a38 38 0 0 1 76 0" stroke="currentColor" strokeWidth="1.25" />
      <path d="M44 58a26 26 0 0 1 52 0" stroke="currentColor" strokeWidth="1.25" />
      <path d="M56 58a14 14 0 0 1 28 0" stroke="currentColor" strokeWidth="1.25" />
      {/* hatching */}
      <path d="M26 50l6 3M36 42l5 4M50 35l4 4M104 50l-6 3M94 42l-5 4M86 35l-4 4" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="70" cy="58" r="2.5" fill="var(--gold)" />
      <path d="M14 66h112" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 72h96" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
    </svg>
  );
}

/** A bridge between two banks — the synthesis. */
export function OrnamentBridge({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={base(className)} {...props}>
      <path d="M10 56h120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 56c10-26 82-26 92 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 56c14-18 78-18 92 0" stroke="currentColor" strokeWidth="1" />
      <path d="M38 42v14M58 36v20M82 36v20M102 42v14" stroke="currentColor" strokeWidth="1" />
      {/* water hatching */}
      <path d="M30 66h14M52 70h18M78 66h14M104 70h12M16 70h8" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
      <circle cx="70" cy="30" r="2.25" fill="var(--gold)" />
    </svg>
  );
}

/** A quill over a blank line — testimony not yet written. */
export function OrnamentQuill({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={base(className)} {...props}>
      <path d="M96 12c-22 6-38 22-46 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M96 12c-4 16-14 30-34 38" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M62 44l10 4M70 34l9 5M78 26l8 5" stroke="currentColor" strokeWidth="0.75" />
      <path d="M50 56l-6 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M28 70h84" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="2 5" />
      <circle cx="44" cy="66" r="2" fill="var(--gold)" />
    </svg>
  );
}

/** Scales held level — questions weighed for selection. */
export function OrnamentScales({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={base(className)} {...props}>
      <path d="M70 14v50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 22h72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 22l-9 22h18l-9-22ZM106 22l-9 22h18l-9-22Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M25 44a9 9 0 0 0 18 0M97 44a9 9 0 0 0 18 0" stroke="currentColor" strokeWidth="1.25" />
      {/* hatching on pans */}
      <path d="M29 48l3 3M33 50l2 2M101 48l3 3M105 50l2 2" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="70" cy="14" r="2.5" fill="var(--gold)" />
      <path d="M52 68h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 73h24" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
    </svg>
  );
}

export type OrnamentName = "forum" | "bridge" | "quill" | "scales";

export function Ornament({ name, className }: { name: OrnamentName; className?: string }) {
  switch (name) {
    case "bridge":
      return <OrnamentBridge className={className} />;
    case "quill":
      return <OrnamentQuill className={className} />;
    case "scales":
      return <OrnamentScales className={className} />;
    default:
      return <OrnamentForum className={className} />;
  }
}
