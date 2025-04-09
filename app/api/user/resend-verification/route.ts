import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/user';
import { sendVerificationEmail } from '../../../../lib/services/email';
import crypto from 'crypto';

/**
 * 重新发送验证邮件 API
 */
export async function POST(request: NextRequest) {
  try {
    // 获取当前令牌
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { userId } = body;
    
    // 确保当前用户只能为自己重发验证邮件
    if (userId !== token.id) {
      return NextResponse.json(
        { error: "You are not authorized to resend verification email for others" },
        { status: 403 }
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
    
    // 检查用户是否已验证
    if (user.isVerified) {
      return NextResponse.json(
        { error: "User email has been verified, no need to resend verification email" },
        { status: 400 }
      );
    }
    
    // 生成新的验证令牌
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // 更新用户验证令牌
    user.verificationToken = verificationToken;
    await user.save();
    
    // 发送验证邮件
    await sendVerificationEmail(user.email, verificationToken, user.username);
    
    return NextResponse.json(
      { success: true, message: "Verification email has been sent, please check your inbox" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend verification email error", error);
    return NextResponse.json(
      { error: error.message || "Failed to resend verification email" },
      { status: 500 }
    );
  }
} 