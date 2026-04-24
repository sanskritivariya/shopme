// Common utility functions for role management using localStorage

const ROLE_KEY = 'user_role'
const USER_KEY = 'user_data'

export interface StoredUser {
  uid: string
  email: string
  role: 'admin' | 'user'
  name?: string
}

/**
 * Save user role and data to localStorage
 */
export const saveUserRole = (user: StoredUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROLE_KEY, user.role)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

/**
 * Get user role from localStorage
 */
export const getUserRole = (): 'admin' | 'user' | null => {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem(ROLE_KEY)
    return role as 'admin' | 'user' | null
  }
  return null
}

/**
 * Get full user data from localStorage
 */
export const getStoredUser = (): StoredUser | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        return null
      }
    }
  }
  return null
}

/**
 * Check if current user is admin
 */
export const isAdmin = (): boolean => {
  return getUserRole() === 'admin'
}

/**
 * Check if current user is regular user
 */
export const isUser = (): boolean => {
  return getUserRole() === 'user'
}

/**
 * Clear user data from localStorage (for logout)
 */
export const clearUserData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

/**
 * Check if user is authenticated (has role stored)
 */
export const isAuthenticated = (): boolean => {
  return getUserRole() !== null
}
