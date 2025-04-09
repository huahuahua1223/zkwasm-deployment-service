"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ResendVerification() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // 重定向未登录用户
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    
    // 用户已登录，获取详细信息
    if (status === "authenticated" && session?.user?.id) {
      fetchUserProfile();
    }
  }, [status, session, router]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/user/profile?userId=${session?.user?.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to get user information");
      }
      
      const data = await response.json();
      setUserData(data.user);
      
      // 如果用户已验证，重定向到个人资料页面
      if (data.user.isVerified) {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Failed to get user information", error);
      setError("Failed to load user information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      
      const response = await fetch("/api/user/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }
      
      setSuccess(data.message || "Verification email has been sent, please check your inbox");
      
      // 5秒后返回个人资料页面
      setTimeout(() => {
        router.push("/profile");
      }, 5000);
    } catch (error) {
      console.error("Failed to resend verification email", error);
      setError(error instanceof Error ? error.message : "An error occurred during the resend verification email process");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Resend verification email</h1>
        <p className="text-gray-600 mt-2">Verify your email to complete account activation</p>
      </div>
      
      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 rounded bg-green-100 p-4 text-green-700">
          <p>{success}</p>
          <p className="mt-2 text-sm">5 seconds will automatically return to the profile page</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        {userData && !userData.isVerified && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-yellow-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              
              <h2 className="mt-4 text-xl font-semibold">Verify your email</h2>
              <p className="mt-2 text-gray-600">
                Your account is not activated. We have already sent a verification email to the following email:
              </p>
              <p className="mt-2 font-medium">{userData.email}</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Please check your inbox and spam folder. If you did not receive the verification email, or the verification link has expired, you can click the button below to resend it.
              </p>
              
              <button
                onClick={handleResendVerification}
                disabled={isSubmitting || success !== ""}
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
              >
                {isSubmitting ? "Sending..." : "Resend verification email"}
              </button>
              
              <Link
                href="/profile"
                className="block w-full bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 text-center"
              >
                Back to profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 