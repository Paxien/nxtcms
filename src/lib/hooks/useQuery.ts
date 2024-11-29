'use client'

import { useCallback, useEffect, useReducer } from 'react'
import { fetchAPI, APIError } from '@/lib/api/client'

interface QueryState<T> {
  data: T | null
  error: APIError | null
  isLoading: boolean
}

type QueryAction<T> =
  | { type: 'loading' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: APIError }

function queryReducer<T>(
  state: QueryState<T>,
  action: QueryAction<T>
): QueryState<T> {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true, error: null }
    case 'success':
      return { data: action.data, error: null, isLoading: false }
    case 'error':
      return { ...state, error: action.error, isLoading: false }
    default:
      return state
  }
}

interface UseQueryOptions {
  enabled?: boolean
}

export function useQuery<T>(
  endpoint: string,
  options: UseQueryOptions & RequestInit = {}
) {
  const { enabled = true, ...fetchOptions } = options

  const [state, dispatch] = useReducer(queryReducer<T>, {
    data: null,
    error: null,
    isLoading: false,
  })

  const execute = useCallback(async () => {
    try {
      dispatch({ type: 'loading' })
      const data = await fetchAPI<T>(endpoint, fetchOptions)
      dispatch({ type: 'success', data })
    } catch (error) {
      dispatch({
        type: 'error',
        error: error instanceof APIError ? error : new APIError('Unknown error', 0),
      })
    }
  }, [endpoint, fetchOptions])

  useEffect(() => {
    if (enabled) {
      execute()
    }
  }, [enabled, execute])

  return {
    ...state,
    refetch: execute,
  }
}
