import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import axiosInstance from '@/utils/axios';

// Fix for authOptions - it should use NEXTAUTH_SECRET, not NEXTAUTH_SECRET_KEY
// You may need to update authOptions.ts to use process.env.NEXTAUTH_SECRET

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug log

    if (!session || !session.user || !session.accessToken) {
      console.log('No session, user, or accessToken'); // Debug log
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({
        message: 'Current password and new password are required'
      }, { status: 400 });
    }

    const response = await axiosInstance.put('/changePassword', {
      oldPassword,
      newPassword
    });
    // Temporarily removed Authorization header to test without token validation

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to change password' },
      { status: error.response?.status || 500 }
    );
  }
}

// If you need to support PUT as well
export async function PUT(request: Request) {
  return POST(request);
}