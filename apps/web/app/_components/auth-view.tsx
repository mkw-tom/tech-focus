"use client"

import { AuthView } from "@neondatabase/auth/react/ui"

type AuthViewClientProps = {
  path: string
}

export function AuthViewClient({ path }: AuthViewClientProps) {
  return <AuthView path={path} />
}
