import nodemailer from 'nodemailer';

// 邮件配置
const config = {
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
};

// 创建Nodemailer传输器
const transporter = nodemailer.createTransport(config);

/**
 * 发送验证邮件
 * @param to 接收者邮箱
 * @param token 验证令牌
 * @param username 用户名
 */
export async function sendVerificationEmail(to: string, token: string, username: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"ZKWasm Auth" <noreply@zkwasm.com>',
    to,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Verify your email address</h2>
        <p>Hello ${username},</p>
        <p>Thank you for registering ZKWasm Deployment Service. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">验证邮箱</a>
        </div>
        <p>Or, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>If you did not register an account, please ignore this email.</p>
        <p>Best regards,</p>
        <p>ZKWasm Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * 发送密码重置邮件
 * @param to 接收者邮箱
 * @param token 重置令牌
 * @param username 用户名
 */
export async function sendPasswordResetEmail(to: string, token: string, username: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"ZKWasm Auth" <noreply@zkwasm.com>',
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Reset your password</h2>
        <p>Hello ${username},</p>
        <p>We received a request to reset your account password. Please click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">重置密码</a>
        </div>
        <p>Or, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will be valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,</p>
        <p>ZKWasm Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
}; 