import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json()

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required',
          error: 'MISSING_FIELDS',
        },
        { status: 400 },
      )
    }

    // Name validation
    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name must be at least 2 characters long',
          error: 'INVALID_NAME',
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          error: 'INVALID_EMAIL',
        },
        { status: 400 },
      )
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters long',
          error: 'WEAK_PASSWORD',
        },
        { status: 400 },
      )
    }

    // Password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Passwords do not match',
          error: 'PASSWORD_MISMATCH',
        },
        { status: 400 },
      )
    }

    // TODO: Add actual registration logic here (database check, password hashing, etc.)
    // For now, simulate successful registration
    const mockUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase(),
      role: 'user', // All signups are users by default
      avatar: null,
      createdAt: new Date().toISOString(),
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: mockUser,
        token: mockToken,
        refreshToken: 'mock-refresh-token-' + Date.now(),
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR',
      },
      { status: 500 },
    )
  }
}
