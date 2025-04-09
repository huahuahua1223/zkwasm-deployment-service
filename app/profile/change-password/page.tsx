"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ChangePassword() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 重定向未登录用户
  if (status === "unauthenticated") {
    router.push("/auth/signin");
  }

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
    setIsSubmitting(true);

    // 验证密码长度
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    // 确认密码匹配
    if (formData.newPassword !== formData.confirmPassword) {
      setError("The new passwords you entered do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess(data.message || "Password updated successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // 5秒后返回个人资料页面
      setTimeout(() => {
        router.push("/profile");
      }, 5000);
    } catch (error) {
      console.error("Failed to change password", error);
      setError(error instanceof Error ? error.message : "An error occurred during the password change process");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Change password</h1>
        <p className="text-gray-600 mt-2">Update your account password</p>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="currentPassword">
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              minLength={6}
              placeholder="Enter the new password again"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || success !== ""}
              className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>

            <Link
              href="/profile"
              className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Password must be at least 6 characters long</p>
        <p className="mt-1">Please use a strong password to ensure account security</p>
      </div>
    </div>
  );
} 