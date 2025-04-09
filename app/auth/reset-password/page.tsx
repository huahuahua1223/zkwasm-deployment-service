"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// 内容组件
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 验证是否有token
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!token) {
      setError("Invalid reset link");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("The passwords you entered do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(data.message || "Password reset successfully");
      
      // 成功后5秒跳转到登录页
      setTimeout(() => {
        router.push('/auth/signin?reset=true');
      }, 5000);
    } catch (error) {
      console.error("Reset password error", error);
      setError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Reset password</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
            <p>{success}</p>
            <p className="mt-2 text-sm">You will be automatically redirected to the login page in 5 seconds.</p>
          </div>
        )}

        {!error || error === "The passwords you entered do not match" || error === "Password must be at least 6 characters long" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="confirmPassword">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        ) : (
          <div className="mt-4 text-center">
            <Link
              href="/auth/forgot-password"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Resend reset link
            </Link>
          </div>
        )}

        <div className="mt-4 text-center text-sm">
          <p>
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// 加载组件
function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Reset password</h1>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}

// 主组件，使用Suspense包裹
export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
} 