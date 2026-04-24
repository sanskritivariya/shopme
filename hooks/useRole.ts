import { useState, useEffect } from 'react'
import { getUserRole, getStoredUser, isAdmin, isUser, isAuthenticated } from '@/utils/auth'

export function useRole() {
  const [role, setRole] = useState<'admin' | 'user' | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage on component mount
    const checkRole = () => {
      const storedRole = getUserRole()
      const storedUser = getStoredUser()
      
      setRole(storedRole)
      setUser(storedUser)
      setLoading(false)
    }

    checkRole()

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_role' || e.key === 'user_data') {
        checkRole()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    role,
    user,
    loading,
    isAdmin: isAdmin(),
    isUser: isUser(),
    isAuthenticated: isAuthenticated(),
  }
}

// Simplified hook for just checking admin status
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = () => {
      const adminStatus = getUserRole() === 'admin'
      setIsAdmin(adminStatus)
      setLoading(false)
    }

    checkAdmin()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_role') {
        checkAdmin()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { isAdmin, loading }
}
