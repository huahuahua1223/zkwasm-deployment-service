import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/user';
import { sendVerificationEmail } from '../../../../lib/services/email';
import crypto from 'crypto';

/**
 * 用户注册API
 */
export async function POST(request: NextRequest) {
  try {
    // 连接数据库
    await connectDB();
    
    const body = await request.json();
    const { username, password, name, email } = body;

    // 验证必填字段
    if (!username || !password || !name || !email) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // 生成验证令牌
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 创建新用户
    const newUser = await User.create({
      username,
      password, // 密码会自动哈希 (在模型的pre-save钩子中)
      name,
      email,
      verificationToken,
      isVerified: false
    });

    // 发送验证邮件
    await sendVerificationEmail(email, verificationToken, username);

    // 返回成功响应
    return NextResponse.json(
      { 
        success: true, 
        message: "Registration successful, please check your email to verify your account", 
        user: { 
          id: newUser._id.toString(), 
          name: newUser.name, 
          email: newUser.email,
          username: newUser.username
        } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
} 