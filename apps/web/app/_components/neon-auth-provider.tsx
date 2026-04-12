"use client"

import { createAuthClient } from "@neondatabase/auth/next"
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui"
import type { ReactNode } from "react"

const authClient = createAuthClient()

type NeonAuthProviderProps = {
  children: ReactNode
}

export function NeonAuthProvider({ children }: NeonAuthProviderProps) {
  return (
    <NeonAuthUIProvider authClient={authClient}>{children}</NeonAuthUIProvider>
  )
}
