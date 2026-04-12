import "server-only"

import { createNeonAuth } from "@neondatabase/auth/next/server"
import {
  isNeonAuthConfigured,
  neonAuthBaseUrl,
  neonAuthCookieSecret,
} from "./auth-config"

function getRequiredAuthConfig() {
  if (!isNeonAuthConfigured || !neonAuthBaseUrl || !neonAuthCookieSecret) {
    throw new Error("Neon Auth is not configured")
  }

  return {
    baseUrl: neonAuthBaseUrl,
    secret: neonAuthCookieSecret,
  }
}

export const auth = isNeonAuthConfigured
  ? (() => {
      const config = getRequiredAuthConfig()

      return createNeonAuth({
        baseUrl: config.baseUrl,
        cookies: {
          secret: config.secret,
        },
      })
    })()
  : null
