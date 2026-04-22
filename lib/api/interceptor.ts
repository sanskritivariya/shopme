// API Interceptor for handling requests, responses, and errors

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface ApiError {
  success: false
  message: string
  error: string
  status?: number
}

export class ApiInterceptor {
  private static baseURL: string = process.env.NEXT_PUBLIC_API_URL || ''

  // Request interceptor - runs before the request is sent
  static async requestInterceptor(
    url: string,
    options: RequestInit = {},
  ): Promise<{ url: string; options: RequestInit }> {
    // Get auth token from localStorage (client-side only)
    let token: string | null = null

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken')
    }

    // Set default headers
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    // Merge with existing headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    }

    // Construct full URL
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`

    return {
      url: fullUrl,
      options: {
        ...options,
        headers,
      },
    }
  }

  // Response interceptor - runs after the response is received
  static async responseInterceptor<T>(
    response: Response,
  ): Promise<ApiResponse<T>> {
    try {
      const data = await response.json()

      if (!response.ok) {
        // Handle HTTP errors
        const errorObj: ApiError = {
          success: false,
          message: data?.message || 'Request failed',
          error: data?.error || 'HTTP_ERROR',
          status: response.status,
        }
        throw errorObj
      }

      // Handle API-level errors
      if (!data.success) {
        const errorObj: ApiError = {
          success: false,
          message: data?.message || 'API request failed',
          error: data?.error || 'API_ERROR',
        }
        throw errorObj
      }

      return data
    } catch (error) {
      // If error is already formatted, re-throw it
      if (error && typeof error === 'object' && 'success' in error) {
        throw error
      }

      // Handle parsing errors or network errors
      const errorObj: ApiError = {
        success: false,
        message: 'Network error or invalid response',
        error: 'NETWORK_ERROR',
        status: response?.status,
      }
      throw errorObj
    }
  }

  // Error interceptor - runs when an error occurs
  static errorInterceptor(error: ApiError): ApiError {
    console.error('API Error:', error)

    // Handle specific error types
    const errorType = error?.error || 'UNKNOWN_ERROR'
    switch (errorType) {
      case 'UNAUTHORIZED':
      case 'INVALID_TOKEN':
        // Clear auth token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        break

      case 'FORBIDDEN':
        // Handle permission errors
        break

      case 'NETWORK_ERROR':
        // Handle network issues
        break

      default:
        // Handle other errors
        break
    }

    return error
  }
}
