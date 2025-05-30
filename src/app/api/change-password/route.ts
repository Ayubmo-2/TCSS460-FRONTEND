import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'utils/authOptions';

// Password validation functions (matching your client-side)
function isNumber(value: string): boolean {
  return new RegExp('^(?=.*[0-9]).+$').test(value);
}

function isLowercaseChar(value: string): boolean {
  return new RegExp('^(?=.*[a-z]).+$').test(value);
}

function isUppercaseChar(value: string): boolean {
  return new RegExp('^(?=.*[A-Z]).+$').test(value);
}

function isSpecialChar(value: string): boolean {
  return new RegExp('^(?=.*[-+_!@#$%^&*.,?]).+$').test(value);
}

function minLength(value: string): boolean {
  return value.length > 7;
}

function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!minLength(password)) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!isNumber(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!isLowercaseChar(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!isUppercaseChar(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!isSpecialChar(password)) {
    errors.push('Password must contain at least one special character (-+_!@#$%^&*.,?)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Mock user data (same as your NextAuth setup)
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'Test123!@',
    firstname: 'Test',
    lastname: 'User',
    company: 'Test Company',
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token'
  }
];

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password format
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          message: 'New password does not meet requirements',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Find user in mock database
    const userEmail = session.user.email;
    const userIndex = mockUsers.findIndex(user => user.email === userEmail);

    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const user = mockUsers[userIndex];

    // Verify current password
    if (user.password !== currentPassword) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { message: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Update password in mock database
    mockUsers[userIndex].password = newPassword;

    // In a real application, you would:
    // 1. Hash the new password before storing
    // 2. Update the database
    // 3. Potentially invalidate existing sessions
    // 4. Send confirmation email

    return NextResponse.json(
      {
        message: 'Password changed successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
