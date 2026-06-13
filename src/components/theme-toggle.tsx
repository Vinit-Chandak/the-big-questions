"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const mounted = useMounted();
  const currentTheme = theme === "dark" || theme === "light" ? theme : resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (mounted && theme === "system") {
      setTheme(currentTheme);
    }
  }, [currentTheme, mounted, setTheme, theme]);

  if (!mounted) {
    return (
      <Button aria-label="Theme loading" variant="ghost" size="icon" disabled>
        <Sun className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  const Icon = currentTheme === "dark" ? Moon : Sun;

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
