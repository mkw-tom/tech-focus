import { aiDigestGeneratedContentSchema } from "@tech-focus/shared"
import type { AiDigestGeneratedContent } from "@tech-focus/shared"

const openAiResponsesUrl = "https://api.openai.com/v1/responses"
const defaultModelName = "gpt-5-mini"

type ResponsesApiResponse = {
  id?: string
  output_text?: string
  status?: string
  incomplete_details?: {
    reason?: string
  } | null
  output?: Array<{
    type?: string
    content?: Array<{
      type?: string
      text?: string
    }>
  }>
}

export class AiDigestClientError extends Error {}

function getOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey) {
    throw new AiDigestClientError("OPENAI_API_KEY is not configured")
  }

  return apiKey
}

function parseGeneratedContent(content: string): AiDigestGeneratedContent {
  try {
    return aiDigestGeneratedContentSchema.parse(JSON.parse(content))
  } catch (error) {
    throw new AiDigestClientError(
      `AI digest response was not valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

export const openAiDigestClient = {
  modelName() {
    return process.env.AI_DIGEST_MODEL?.trim() || defaultModelName
  },

  async generate(prompt: string): Promise<AiDigestGeneratedContent> {
    const model = this.modelName()
    const response = await fetch(openAiResponsesUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getOpenAiApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "developer",
            content: [
              {
                type: "input_text",
                text: "Return only JSON that matches the requested schema. Do not include Markdown.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: prompt,
              },
            ],
          },
        ],
        max_output_tokens: 5000,
        reasoning: {
          effort: "minimal",
        },
        text: {
          format: {
            type: "json_schema",
            name: "ai_digest",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: [
                "title",
                "summary",
                "shortImpact",
                "recommendedAction",
                "importance",
                "background",
                "changedContent",
                "detailedImpact",
                "affectedAudience",
                "investigationMemo",
                "detailedReport",
              ],
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                shortImpact: { type: "string" },
                recommendedAction: { type: "string" },
                importance: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                },
                background: { type: "string" },
                changedContent: { type: "string" },
                detailedImpact: { type: "string" },
                affectedAudience: { type: "string" },
                investigationMemo: { type: "string" },
                detailedReport: { type: "string" },
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "")
      throw new AiDigestClientError(
        `OpenAI digest generation failed: ${response.status} ${errorBody}`,
      )
    }

    const payload = (await response.json()) as ResponsesApiResponse

    if (payload.status === "incomplete") {
      throw new AiDigestClientError(
        `OpenAI digest response was incomplete: reason=${
          payload.incomplete_details?.reason ?? "unknown"
        } id=${payload.id ?? "unknown"}`,
      )
    }

    const content =
      payload.output_text ??
      payload.output
        ?.flatMap((output) => output.content ?? [])
        .map((item) => item.text)
        .find((text): text is string => Boolean(text?.trim()))

    if (!content) {
      throw new AiDigestClientError(
        `OpenAI digest response was empty: status=${payload.status ?? "unknown"} reason=${
          payload.incomplete_details?.reason ?? "none"
        } id=${payload.id ?? "unknown"}`,
      )
    }

    return parseGeneratedContent(content)
  },
}
