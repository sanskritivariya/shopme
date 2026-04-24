'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { saveUserRole, clearUserData, getStoredUser } from '@/utils/auth'

interface UserProfile {
  uid: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  name?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; role?: string; error?: string }>
  signup: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize with localStorage data if available (for faster initial load)
    const storedUser = getStoredUser()
    if (storedUser) {
      setUserProfile(storedUser as UserProfile)
      console.log('Initialized userProfile from localStorage:', storedUser)
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email || 'No user')
      setUser(user)

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile
          setUserProfile(profile)

          // Update localStorage with current profile data
          saveUserRole({
            uid: profile.uid,
            email: profile.email,
            role: profile.role,
            name: profile.name,
          })
          console.log('Updated userProfile from Firestore:', profile)
        } else {
          // Create a default profile for users without Firestore document
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            role: 'user', // Default role, can be updated manually in Firestore
            createdAt: new Date().toISOString(),
            name: user.displayName || '',
          }
          setUserProfile(defaultProfile)

          // Optionally create the document in Firestore
          try {
            await setDoc(doc(db, 'users', user.uid), defaultProfile)
            saveUserRole({
              uid: defaultProfile.uid,
              email: defaultProfile.email,
              role: defaultProfile.role,
              name: defaultProfile.name,
            })
            console.log('Created default profile:', defaultProfile)
          } catch (error) {
            console.error('Error creating user document:', error)
          }
        }
      } else {
        setUserProfile(null)
        clearUserData()
        console.log('User logged out, cleared profile')
      }

      setLoading(false)
    })

    return unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))

      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile

        // Update state immediately
        setUserProfile(profile)

        // Save user data to localStorage
        saveUserRole({
          uid: profile.uid,
          email: profile.email,
          role: profile.role,
          name: profile.name,
        })

        return { success: true, role: profile.role }
      } else {
        return { success: false, error: 'User profile not found' }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (email: string, password: string, name?: string) => {
    try {
      console.log('Starting signup for:', email)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      console.log('User created in Firebase Auth:', userCredential.user.uid)

      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        role: 'user',
        createdAt: new Date().toISOString(),
        name: name || '',
      }

      console.log('Creating Firestore document:', userProfile)
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile)
      console.log('Firestore document created successfully')
      setUserProfile(userProfile)

      // Save user data to localStorage
      saveUserRole({
        uid: userProfile.uid,
        email: userProfile.email,
        role: userProfile.role,
        name: userProfile.name,
      })

      return { success: true }
    } catch (error: any) {
      console.error('Signup error details:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await signOut(auth)
    // Clear user data from localStorage
    clearUserData()
  }

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
