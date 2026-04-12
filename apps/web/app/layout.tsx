import type { Metadata } from "next"
import type { ReactNode } from "react"
import { NeonAuthProvider } from "./_components/neon-auth-provider"
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
    <html lang="ja">
      <body>
        <NeonAuthProvider>
          <StoryPreferenceProvider>{children}</StoryPreferenceProvider>
        </NeonAuthProvider>
      </body>
    </html>
  )
}
