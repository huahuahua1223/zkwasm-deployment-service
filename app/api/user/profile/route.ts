import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/user';
import mongoose from 'mongoose';

/**
 * 获取用户个人资料 GET 接口
 */
export async function GET(request: NextRequest) {
  try {
    // 获取当前令牌
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    
    // 获取URL参数中的userId
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "Missing user ID parameter" },
        { status: 400 }
      );
    }
    
    // 确保当前用户只能访问自己的信息
    if (userId !== token.id) {
      return NextResponse.json(
        { error: "You are not authorized to access other people's information" },
        { status: 403 }
      );
    }
    
    // 连接数据库
    await connectDB();
    
    // 查找用户
    let user = null;
    
    // 如果token中有邮箱，优先通过邮箱查询
    if (token.email) {
      user = await User.findOne({ email: token.email }).select('-password -__v');
      console.log(`通过邮箱 ${token.email} 查询用户`);
    }
    
    // 如果通过邮箱未找到用户，且userId是有效的ObjectId，则尝试通过ID查询
    if (!user && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select('-password -__v');
      console.log(`通过ID ${userId} 查询用户`);
    }
    
    // 如果仍未找到用户且有username，则尝试通过username查询
    if (!user && token.username) {
      user = await User.findOne({ username: token.username }).select('-password -__v');
      console.log(`通过用户名 ${token.username} 查询用户`);
    }
    
    if (!user) {
      console.log('未找到用户，调试信息:', {
        tokenId: token.id,
        email: token.email,
        username: token.username
      });
      
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }
    
    console.log(`找到用户: ${user.username}`);
    
    return NextResponse.json(
      { 
        success: true, 
        user: user.toObject() 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get user information error", error);
    return NextResponse.json(
      { error: error.message || "Failed to get user information" },
      { status: 500 }
    );
  }
}

/**
 * 更新用户个人资料 PUT 接口
 */
export async function PUT(request: NextRequest) {
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
    const { userId, name } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Missing user ID parameter" },
        { status: 400 }
      );
    }
    
    // 确保当前用户只能修改自己的信息
    if (userId !== token.id) {
      return NextResponse.json(
        { error: "You are not authorized to modify other people's information" },
        { status: 403 }
      );
    }
    
    // 验证输入
    if (!name) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 }
      );
    }
    
    // 连接数据库
    await connectDB();
    
    // 查找用户
    let user = null;
    
    // 如果token中有邮箱，优先通过邮箱查询
    if (token.email) {
      user = await User.findOne({ email: token.email });
    }
    
    // 如果通过邮箱未找到用户，且userId是有效的ObjectId，则尝试通过ID查询
    if (!user && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    }
    
    // 如果仍未找到用户且有username，则尝试通过username查询
    if (!user && token.username) {
      user = await User.findOne({ username: token.username });
    }
    
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }
    
    // 更新用户信息
    user.name = name;
    await user.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Personal information updated",
        user: {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update user information error", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user information" },
      { status: 500 }
    );
  }
} 