"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button aria-label="Theme loading" variant="ghost" size="icon" disabled>
        <Monitor className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <Button
      aria-label={`Switch theme to ${nextTheme}`}
      title={`Switch theme to ${nextTheme}`}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme)}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}
