"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// 内容组件
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus('error');
        setMessage("Invalid verification link");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        
        if (response.ok) {
          setStatus('success');
          // 成功后5秒跳转到登录页
          setTimeout(() => {
            router.push('/auth/signin?verified=true');
          }, 5000);
        } else {
          const data = await response.json();
          setStatus('error');
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus('error');
        setMessage("An error occurred during the verification process");
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md text-center">
        <h1 className="mb-6 text-2xl font-bold">
          {status === 'loading' && 'Verifying email...'}
          {status === 'success' && 'Email verified successfully!'}
          {status === 'error' && 'Verification failed'}
        </h1>

        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <p className="mb-4 text-green-600">Your email has been successfully verified.</p>
            <p className="mb-6">You will be automatically redirected to the login page in 5 seconds.</p>
            <Link
              href="/auth/signin"
              className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p className="mb-4 text-red-600">{message}</p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Register
              </Link>
              <Link
                href="/"
                className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Back to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 加载组件
function VerifyEmailLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md text-center">
        <h1 className="mb-6 text-2xl font-bold">Preparing verification...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
}

// 主组件，使用Suspense包裹
export default function VerifyEmail() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
} 