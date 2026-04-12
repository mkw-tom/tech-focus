import { NextResponse } from "next/server"
import { auth } from "./app/_lib/auth"
import { isNeonAuthConfigured } from "./app/_lib/auth-config"

export default function proxy(request: Request) {
  if (!isNeonAuthConfigured || !auth) {
    return NextResponse.next()
  }

  return auth.middleware({
    loginUrl: "/auth/sign-in",
  })(request as never)
}

export const config = {
  matcher: ["/account/:path*", "/topics", "/bookmarks", "/likes"],
}
