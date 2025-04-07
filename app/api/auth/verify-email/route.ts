import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/user';

/**
 * 验证邮箱 API
 */
export async function GET(request: NextRequest) {
  try {
    // 从URL中获取验证令牌
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 }
      );
    }
    
    // 连接数据库
    await connectDB();
    
    // 查找具有此验证令牌的用户
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification link or expired" },
        { status: 404 }
      );
    }
    
    // 更新用户为已验证状态
    user.isVerified = true;
    user.verificationToken = undefined; // 清除验证令牌
    await user.save();
    
    // 重定向到登录页面，并带上verified=true参数
    return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url));
  } catch (error: any) {
    console.error("Email verification error", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during the verification process" },
      { status: 500 }
    );
  }
} 