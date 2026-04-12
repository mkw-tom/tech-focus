import { NextResponse } from "next/server"
import { auth } from "../../../_lib/auth"

export const dynamic = "force-dynamic"

const disabledResponse = () =>
  NextResponse.json(
    {
      error: "Neon Auth is not configured",
    },
    { status: 503 },
  )

export const GET = auth ? auth.handler().GET : disabledResponse
export const POST = auth ? auth.handler().POST : disabledResponse
export const PUT = auth ? auth.handler().PUT : disabledResponse
export const DELETE = auth ? auth.handler().DELETE : disabledResponse
export const PATCH = auth ? auth.handler().PATCH : disabledResponse
