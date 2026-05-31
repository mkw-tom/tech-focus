import {
  aiDigestResponseSchema,
  aiDigestRouteParamsSchema,
} from "@tech-focus/shared"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import {
  AiDigestGenerationError,
  AiDigestNotFoundError,
  AiDigestProcessingError,
  aiDigestService,
} from "../services/ai-digest/ai-digest-service.js"

export const aiDigestRoutes = new Hono()

aiDigestRoutes.get("/:targetType/:targetId", async (c) => {
  const params = aiDigestRouteParamsSchema.parse(c.req.param())

  try {
    return c.json(
      aiDigestResponseSchema.parse(await aiDigestService.getDigest(params)),
    )
  } catch (error) {
    if (error instanceof AiDigestNotFoundError) {
      throw new HTTPException(404, { message: error.message })
    }

    if (error instanceof AiDigestProcessingError) {
      throw new HTTPException(409, { message: error.message })
    }

    if (error instanceof AiDigestGenerationError) {
      throw new HTTPException(500, { message: error.message })
    }

    throw error
  }
})
