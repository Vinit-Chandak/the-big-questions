import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("theme tokens", () => {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

  it("uses the Zed-attributed iA Writer Quattro face first", () => {
    expect(css).toContain('"iA Writer Quattro"');
    expect(css.indexOf('"iA Writer Quattro"')).toBeLessThan(css.indexOf('"IBM Plex Sans"'));
  });

  it("does not scale type directly from viewport width", () => {
    expect(css).not.toMatch(/font-size:\s*[^;]*vw/);
    expect(css).not.toMatch(/clamp\([^;]*vw/);
  });

  it("keeps letter spacing neutral", () => {
    expect(css).not.toMatch(/letter-spacing:\s*-/);
  });
});
