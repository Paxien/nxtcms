export type Route = {
  path: string
  name: string
  icon?: string
}

export type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
}

export type Theme = 'light' | 'dark' | 'system'
