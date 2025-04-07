import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/user';
import { sendPasswordResetEmail } from '../../../../lib/services/email';
import crypto from 'crypto';

/**
 * 忘记密码 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Please provide an email address" },
        { status: 400 }
      );
    }
    
    // 连接数据库
    await connectDB();
    
    // 查找用户
    const user = await User.findOne({ email });
    
    // 即使找不到用户，也返回成功，以防止邮箱枚举攻击
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If the email is registered, you will receive a reset password email" },
        { status: 200 }
      );
    }
    
    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // 设置令牌过期时间 (1小时后)
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    // 更新用户信息
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // 发送重置密码邮件
    await sendPasswordResetEmail(user.email, resetToken, user.username);
    
    return NextResponse.json(
      { success: true, message: "Reset password email has been sent, please check your inbox" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during the forgot password request" },
      { status: 500 }
    );
  }
} 