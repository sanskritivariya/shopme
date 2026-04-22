import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
          error: 'MISSING_FIELDS',
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

    // TODO: Add actual authentication logic here (database check, password hashing, etc.)
    // For now, simulate successful login with role-based logic

    // Determine role based on email (simple mock logic)
    const isAdmin = email === 'admin@example.com'

    const mockUser = {
      id: isAdmin ? 'admin-1' : 'user-' + Date.now(),
      email: email,
      name: isAdmin ? 'Admin User' : 'John Doe',
      role: isAdmin ? 'admin' : 'user',
      avatar: null,
      createdAt: new Date().toISOString(),
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        token: mockToken,
        refreshToken: 'mock-refresh-token-' + Date.now(),
      },
    })
  } catch (error) {
    console.error('Login error:', error)
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
