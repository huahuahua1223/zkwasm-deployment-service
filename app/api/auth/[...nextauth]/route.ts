import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";
import connectDB from "../../../../lib/db/mongodb";
import User from "../../../../lib/models/user";


// 定义认证选项
const authOptions: AuthOptions = {
    providers: [
        // GitHub 登录
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    // 如果是OAuth登录，我们假设邮箱已验证
                    isVerified: true
                };
            }
        }),
        // Google 登录
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    // 如果是OAuth登录，我们假设邮箱已验证
                    isVerified: true
                };
            }
        }),
        // 用户名密码登录
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 连接数据库
                await connectDB();
                
                // 验证用户凭据
                if (credentials?.username && credentials?.password) {
                    // 尝试通过用户名查找用户
                    const user = await User.findOne({ 
                        $or: [
                            { username: credentials.username },
                            { email: credentials.username } // 支持使用邮箱登录
                        ]
                    });
                    
                    if (user && await user.comparePassword(credentials.password)) {
                        // 验证用户邮箱是否已验证
                        if (!user.isVerified) {
                            throw new Error("Please verify your email address");
                        }
                        
                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified
                        };
                    }
                }
                
                return null;
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // 初次登录时将用户信息添加到token
            if (user) {
                token.id = user.id;
                token.isVerified = user.isVerified;
                if (user.username) {
                    token.username = user.username;
                }
            }
            return token;
        },
        async session({ session, token }) {
            // 将token中的信息传递到session
            if (session.user) {
                session.user.id = token.id as string;
                session.user.isVerified = token.isVerified as boolean;
                if (token.username) {
                    session.user.username = token.username as string;
                }
            }
            return session;
        },
        async signIn({ account, profile, user }) {
            // 对于OAuth登录，我们需要处理用户创建/更新
            if (account?.provider === "github" || account?.provider === "google") {
                await connectDB();
                
                // 检查用户是否已存在
                const email = profile?.email;
                if (!email) return false; // 需要邮箱
                
                const existingUser = await User.findOne({ email });
                
                if (existingUser) {
                    // 用户已存在，更新信息
                    existingUser.name = profile?.name || existingUser.name;
                    existingUser.isVerified = true; // OAuth登录的用户视为已验证
                    await existingUser.save();
                } else {
                    // 创建新用户
                    const username = profile?.email?.split('@')[0] || `user${Date.now()}`;
                    
                    // 确保用户名唯一
                    let uniqueUsername = username;
                    let counter = 1;
                    while (await User.findOne({ username: uniqueUsername })) {
                        uniqueUsername = `${username}${counter}`;
                        counter++;
                    }
                    
                    await User.create({
                        email,
                        username: uniqueUsername,
                        name: profile?.name || uniqueUsername,
                        // 设置一个随机密码
                        password: Math.random().toString(36).slice(-10),
                        isVerified: true // OAuth登录的用户视为已验证
                    });
                }
            }
            
            return true;
        }
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30天
    },
    secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-key-for-dev",
};

// 创建处理器
const handler = NextAuth(authOptions);

// 只导出标准的NextAuth处理器，不导出其他函数或变量
export { handler as GET, handler as POST };