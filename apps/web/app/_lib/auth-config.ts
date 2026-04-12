export const neonAuthBaseUrl = process.env.NEON_AUTH_BASE_URL
export const neonAuthCookieSecret = process.env.NEON_AUTH_COOKIE_SECRET

export const isNeonAuthConfigured = Boolean(
  neonAuthBaseUrl && neonAuthCookieSecret && neonAuthCookieSecret.length >= 32,
)
