import type { Metadata, Viewport } from "next";
import { PeopleProvider } from "@/contexts/people-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "People — for the people, by the people",
  description:
    "People is an open speech and community platform: 16 specialized Cores, pseudonymous profiles, live discussions, and glassmorphic realtime discourse.",
  keywords: ["people", "open speech", "community", "cores", "live discussions", "pseudonymous"],
  openGraph: {
    title: "People — for the people, by the people",
    description: "Open speech & community platform with 16 specialized Cores.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0c10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <PeopleProvider>
          {children}
          <Toaster richColors closeButton />
        </PeopleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
