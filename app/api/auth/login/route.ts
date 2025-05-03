import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // In a real implementation, you would:
    // 1. Validate the email and password
    // 2. Check against a database
    // 3. Generate JWT tokens
    // 4. Set cookies for authentication

    // Mock successful authentication
    if (email && password) {
      // Set a mock token in cookies
      cookies().set({
        name: 'auth_token',
        value: 'mock_jwt_token',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({
        success: true,
        user: {
          id: '1',
          email,
          name: 'Demo User',
          role: 'user',
        },
        token: 'mock_jwt_token',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
