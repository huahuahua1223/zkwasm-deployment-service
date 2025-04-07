"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function EditProfile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
  });
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
      setFormData({
        name: data.user.name,
      });
    } catch (error) {
      console.error("Failed to get user information", error);
      setError("Failed to load user information");
    } finally {
      setIsLoading(false);
    }
  };
  
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
    
    if (!formData.name.trim()) {
      setError("Name cannot be empty");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          name: formData.name,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      
      setSuccess(data.message || "Profile updated successfully");
      setUserData(data.user);
      
      // 更新会话中的用户名
      update({ name: formData.name });
      
      // 5秒后返回个人资料页面
      setTimeout(() => {
        router.push("/profile");
      }, 5000);
    } catch (error) {
      console.error("Failed to update profile", error);
      setError(error instanceof Error ? error.message : "An error occurred during the update process");
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
        <h1 className="text-3xl font-bold">Edit profile</h1>
        <p className="text-gray-600 mt-2">Update your personal information</p>
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
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              This name will be displayed on your profile page
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-700">
              {userData?.username}
              <span className="block mt-1 text-xs text-gray-500">Username cannot be modified</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-700">
              {userData?.email}
              <span className="block mt-1 text-xs text-gray-500">Email cannot be modified</span>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || success !== ""}
              className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
            
            <Link
              href="/profile"
              className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 text-center"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 