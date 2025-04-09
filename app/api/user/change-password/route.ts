import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/user';

/**
 * 修改密码 API
 */
export async function POST(request: NextRequest) {
  try {
    // 使用JWT令牌而不是session
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;
    
    // 确保当前用户只能修改自己的密码
    if (userId !== token.id) {
      return NextResponse.json(
        { error: "You are not authorized to modify the password of others" },
        { status: 403 }
      );
    }
    
    // 验证输入
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    
    // 连接数据库
    await connectDB();
    
    // 查找用户
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }
    
    // 验证当前密码
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Change password error", error);
    return NextResponse.json(
      { error: error.message || "Failed to update password" },
      { status: 500 }
    );
  }
} 