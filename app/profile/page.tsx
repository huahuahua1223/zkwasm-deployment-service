"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");
  
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
    } catch (error) {
      console.error("Failed to get user information", error);
      setError("Failed to load user information");
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your personal information</p>
      </div>
      
      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          {error}
          <button 
            onClick={fetchUserProfile} 
            className="ml-4 text-blue-600 underline"
          >
            Retry
          </button>
        </div>
      )}
      
      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-gray-200">
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={userData.name || "User avatar"} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">
                      <span className="text-3xl font-bold">
                        {userData.name ? userData.name[0].toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                </div>
                
                <h2 className="mt-4 text-xl font-semibold">{userData.name}</h2>
                <p className="text-gray-600">@{userData.username}</p>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center py-2">
                  <span className="text-gray-600 w-24">Account status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${userData.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {userData.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="flex items-center py-2">
                  <span className="text-gray-600 w-24">Registration time:</span>
                  <span className="text-gray-800">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/profile/edit"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center"
                >
                  Edit profile
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Account information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Username</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {userData.username}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {userData.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {userData.email}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4">Security options</h3>
                <div className="space-y-4">
                  <Link 
                    href="/profile/change-password"
                    className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-center"
                  >
                    Change password
                  </Link>
                  
                  {!userData.isVerified && (
                    <Link 
                      href="/profile/resend-verification"
                      className="block px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-center"
                    >
                      Resend verification email
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 