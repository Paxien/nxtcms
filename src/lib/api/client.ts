import { z } from 'zod'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json',
}

export const apiResponseSchema = z.object({
  data: z.unknown(),
  error: z.string().optional(),
})

type APIOptions = RequestInit & {
  params?: Record<string, string>
  query?: Record<string, string>
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  
  const data = isJson ? await response.json() : await response.text()
  
  if (!response.ok) {
    throw new APIError(
      data.error || 'An error occurred',
      response.status,
      data
    )
  }

  const parsed = apiResponseSchema.safeParse(data)
  if (!parsed.success) {
    throw new APIError('Invalid API response', response.status, data)
  }

  return parsed.data.data as T
}

export async function fetchAPI<T>(
  endpoint: string,
  options: APIOptions = {}
): Promise<T> {
  const {
    params = {},
    query = {},
    headers = {},
    ...init
  } = options

  // Replace URL parameters
  const url = Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`{${key}}`, value),
    endpoint
  )

  // Add query parameters
  const queryString = new URLSearchParams(query).toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url

  try {
    const response = await fetch(fullUrl, {
      ...init,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    })

    return handleResponse<T>(response)
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      'Network error',
      0,
      error instanceof Error ? error.message : error
    )
  }
}
