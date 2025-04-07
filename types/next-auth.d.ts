import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * 扩展用户对象类型
   */
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
    isVerified?: boolean;
  }

  /**
   * 扩展Session类型
   */
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      isVerified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** 扩展JWT类型 */
  interface JWT {
    id?: string;
    username?: string | null;
    isVerified?: boolean;
  }
} 