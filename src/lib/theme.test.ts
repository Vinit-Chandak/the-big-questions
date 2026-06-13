import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("theme tokens", () => {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

  it("leads the serif voice with Newsreader and the sans voice with IBM Plex Sans", () => {
    const serifStack = css.match(/--font-serif-stack:\s*([^;]+);/)?.[1] ?? "";
    const sansStack = css.match(/--font-sans-stack:\s*([^;]+);/)?.[1] ?? "";
    expect(serifStack).toMatch(/^"Newsreader"/);
    expect(sansStack).toMatch(/^"IBM Plex Sans"/);
  });

  it("keeps the root type scale stepped in px, not viewport-scaled", () => {
    const htmlBlocks = css.match(/html\s*{[^}]*}/g) ?? [];
    expect(htmlBlocks.length).toBeGreaterThan(0);
    for (const block of htmlBlocks) {
      expect(block).not.toMatch(/font-size:[^;]*vw/);
    }
  });

  it("bounds every fluid clamp() with rem floors and ceilings", () => {
    const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const clamps = cssWithoutComments.match(/clamp\([^)]*\)/g) ?? [];
    expect(clamps.length).toBeGreaterThan(0);
    for (const expression of clamps) {
      expect(expression).toMatch(/^clamp\(\s*\d+(\.\d+)?rem\s*,/);
      expect(expression).toMatch(/,\s*\d+(\.\d+)?rem\s*\)$/);
    }
  });

  it("keeps letter spacing neutral or positive", () => {
    expect(css).not.toMatch(/letter-spacing:\s*-/);
  });

  it("defines separate civic and institutional signal colors in both themes", () => {
    const root = css.match(/:root\s*{[^}]*}/)?.[0] ?? "";
    const dark = css.match(/\.dark\s*{[^}]*}/)?.[0] ?? "";
    for (const block of [root, dark]) {
      expect(block).toContain("--civic:");
      expect(block).toContain("--institutional:");
    }
  });
});
