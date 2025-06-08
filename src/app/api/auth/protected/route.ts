import { NextResponse } from 'next/server';
import axiosInstance from '@/utils/axios';

export async function POST(request: Request) {
  try {
    console.log('Password change request received');

    const { oldPassword, newPassword } = await request.json();
    console.log('Request data received:', { hasOldPassword: !!oldPassword, hasNewPassword: !!newPassword });

    if (!oldPassword || !newPassword) {
      return NextResponse.json({
        message: 'Current password and new password are required'
      }, { status: 400 });
    }

    console.log('Calling external API...');
    const response = await axiosInstance.put('/changePassword', {
      oldPassword,
      newPassword
    });

    console.log('External API response:', response.status);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to change password' },
      { status: error.response?.status || 500 }
    );
  }
}