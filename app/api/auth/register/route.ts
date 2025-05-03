import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // In a real implementation, you would:
    // 1. Validate the input data
    // 2. Check if the user already exists
    // 3. Hash the password
    // 4. Store the user in a database
    // 5. Generate JWT tokens

    // Mock successful registration
    if (email && password && name) {
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
          name,
          role: 'user',
        },
        token: 'mock_jwt_token',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid registration data' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
