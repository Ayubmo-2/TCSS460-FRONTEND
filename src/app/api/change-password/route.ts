import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import axiosInstance from '@/utils/axios';

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

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
    }

    const response = await axiosInstance.put('/changePassword', {
      oldPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to change password' },
      { status: error.response?.status || 500 }
    );
  }
}
