"use client"

import { AccountView } from "@neondatabase/auth/react/ui"

type AccountViewClientProps = {
  path: string
}

export function AccountViewClient({ path }: AccountViewClientProps) {
  return <AccountView path={path} />
}
