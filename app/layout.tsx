import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = localFont({
  src: "../public/fonts/Inter-Regular.woff2",
  display: "swap",
})

export const metadata: Metadata = {
  title: "LASU Learn - Computer Science E-Learning Platform",
  description: "Interactive learning platform for Computer Science students at Lagos State University",
  keywords: [
    "e-learning",
    "computer science",
    "LASU",
    "education",
    "programming",
    "web development",
  ],
  authors: [{ name: "LASU Computer Science Department" }],
  openGraph: {
    title: "LASU Learn - Computer Science E-Learning Platform",
    description: "Interactive learning platform for Computer Science students at Lagos State University",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LASU Learn - Computer Science E-Learning Platform",
    description: "Interactive learning platform for Computer Science students at Lagos State University",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

