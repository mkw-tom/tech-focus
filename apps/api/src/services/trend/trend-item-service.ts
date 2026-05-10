import type {
  TrendItemsByTechResponse,
  TrendItemsQuery,
} from "@tech-focus/shared"
import { trendItemsByTechResponseSchema } from "@tech-focus/shared"
import { trendItemRepository } from "../../repositories/trend-item-repository.js"

export const trendItemService = {
  async listTrendItems(
    params: TrendItemsQuery,
  ): Promise<TrendItemsByTechResponse> {
    const items = await trendItemRepository.list(params)

    return trendItemsByTechResponseSchema.parse({
      tech: params.tech,
      items,
    })
  },
}
