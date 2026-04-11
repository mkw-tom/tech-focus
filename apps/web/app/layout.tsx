import type { Metadata } from "next"
import type { ReactNode } from "react"
import { StoryPreferenceProvider } from "./_components/story-preference-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "tech-focus",
  description: "Next.js app in a Turborepo workspace",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ja" data-theme="business">
      <body>
        <StoryPreferenceProvider>{children}</StoryPreferenceProvider>
      </body>
    </html>
  )
}
