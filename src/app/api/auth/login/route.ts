import { NextResponse } from 'next/server';

// Mock user data - replace with actual database
const users = [
  {
    id: 1,
    email: 'buyer@example.com',
    password: 'password123', // In real app, use hashed passwords
    name: 'John Doe',
    type: 'buyer'
  },
  {
    id: 2,
    email: 'artist@example.com',
    password: 'password123',
    name: 'Jane Artist',
    type: 'artist'
  }
];

export async function POST(request: Request) {
  try {
    const { email, password, userType } = await request.json();

    // In a real application, we would:
    // 1. Validate the input
    // 2. Check against a real database
    // 3. Use proper password hashing
    // 4. Generate a JWT token
    
    const user = users.find(u => 
      u.email === email && 
      u.password === password && 
      u.type === userType
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In a real app, you would sign a JWT here
    const token = 'mock_jwt_token';

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 