import { BaseDocument } from "../document/base.document"

export interface PaginatedResponse<TDocument extends BaseDocument> {
  data: TDocument[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
}
