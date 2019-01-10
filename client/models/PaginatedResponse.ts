export default interface PaginatedResponse<T> {
    data: T[]
    links: ResponseLinks
    meta: ResponseMetadata
}

export interface ResponseMetadata {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
}

export interface ResponseLinks {
    first: string
    prev: string
    next: string
    last: string
}
