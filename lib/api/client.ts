// Common API client utility with interceptor integration

import { ApiInterceptor, ApiResponse, ApiError } from './interceptor'

export class ApiClient {
  private static async request<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      // Apply request interceptor
      const { url: finalUrl, options: finalOptions } =
        await ApiInterceptor.requestInterceptor(url, options)

      // Make the request
      const response = await fetch(finalUrl, finalOptions)

      // Apply response interceptor
      return await ApiInterceptor.responseInterceptor<T>(response)
    } catch (error) {
      // Apply error interceptor
      throw ApiInterceptor.errorInterceptor(error as ApiError)
    }
  }

  // HTTP Methods
  static async get<T>(
    url: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  static async post<T>(
    url: string,
    data?: any,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async put<T>(
    url: string,
    data?: any,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async patch<T>(
    url: string,
    data?: any,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async delete<T>(
    url: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }
}

// Auth API specific methods
export class AuthApi {
  static async login(credentials: { email: string; password: string }) {
    const response = await ApiClient.post('/api/auth/login', credentials)

    // Store tokens in localStorage
    if (response.success && response.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('userRole', response.data.user.role)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
      }
    }

    return response
  }

  static async signup(userData: {
    name: string
    email: string
    password: string
    confirmPassword: string
    role: string
  }) {
    const response = await ApiClient.post('/api/auth/signup', userData)

    // Store tokens in localStorage
    if (response.success && response.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('userRole', response.data.user.role)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
      }
    }

    return response
  }

  static async logout() {
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userRole')
    }

    // TODO: Call logout API endpoint if exists
    return { success: true, message: 'Logged out successfully' }
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('authToken')
  }

  static getUserRole(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userRole')
  }

  static isAdmin(): boolean {
    return this.getUserRole() === 'admin'
  }

  static isUser(): boolean {
    return this.getUserRole() === 'user'
  }

  static getCurrentUser(): any {
    if (typeof window === 'undefined') return null

    try {
      const token = localStorage.getItem('authToken')
      if (!token) return null

      // TODO: Decode JWT token or call user profile API
      // For now, return null
      return null
    } catch {
      return null
    }
  }
}

// User API specific methods
export class UserApi {
  static async getProfile() {
    return ApiClient.get('/api/users/profile')
  }

  static async updateProfile(data: any) {
    return ApiClient.put('/api/users/profile', data)
  }

  static async getUsers() {
    return ApiClient.get('/api/users')
  }

  static async createUser(userData: any) {
    return ApiClient.post('/api/users', userData)
  }

  static async deleteUser(id: string) {
    return ApiClient.delete(`/api/users/${id}`)
  }
}

// Product API specific methods
export class ProductApi {
  static async getProducts(params?: { category?: string; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append('category', params.category)
    if (params?.search) searchParams.append('search', params.search)

    const url = searchParams.toString()
      ? `/api/products?${searchParams.toString()}`
      : '/api/products'

    return ApiClient.get(url)
  }

  static async getProduct(id: string) {
    return ApiClient.get(`/api/products/${id}`)
  }

  static async createProduct(productData: {
    name: string
    description: string
    price: number
    image?: string
    sizes?: string[]
    category?: string
    stock?: number
  }) {
    return ApiClient.post('/api/products', productData)
  }

  static async updateProduct(
    id: string,
    productData: {
      name: string
      description: string
      price: number
      image?: string
      sizes?: string[]
      category?: string
      stock?: number
    },
  ) {
    return ApiClient.put(`/api/products/${id}`, productData)
  }

  static async deleteProduct(id: string) {
    return ApiClient.delete(`/api/products/${id}`)
  }
}

// Export all APIs
export { ApiClient as default }
