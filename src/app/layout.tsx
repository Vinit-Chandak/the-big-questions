import "@fontsource/ia-writer-quattro/400.css";
import "@fontsource/ia-writer-quattro/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "The Big Questions",
  description: "A weekly civic hearing for AI questions, views, verification, and follow-up clarification."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1815" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
