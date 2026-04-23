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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile)
        }
      } else {
        setUserProfile(null)
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
