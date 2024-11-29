/**
 * Base API configuration and helper methods
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Enhanced fetch with timeout and error handling
 */
async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = 5000, ...fetchOptions } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(id)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

/**
 * API client with common methods
 */
export const api = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    return response.json()
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: unknown, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: unknown, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    return response.json()
  },
}
