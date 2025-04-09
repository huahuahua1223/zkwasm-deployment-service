import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/user';

/**
 * 重置密码 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;
    
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    
    // 连接数据库
    await connectDB();
    
    // 查找具有此重置令牌的用户
    const user = await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // 令牌未过期
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link" },
        { status: 400 }
      );
    }
    
    // 更新密码
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return NextResponse.json(
      { success: true, message: "Password reset successfully, please use the new password to login" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password reset error", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during the password reset process" },
      { status: 500 }
    );
  }
} 