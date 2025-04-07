"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// 抽取实际内容到单独组件
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    default: "authentication error",
    configuration: "server configuration error",
    accessdenied: "access denied",
    verification: "login link has expired or has been used",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md text-center">
        <h1 className="mb-4 text-xl font-medium text-red-600">login error</h1>
        <p className="mb-6">{errorMessage}</p>
        <Link 
          href="/auth/signin"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          back to login
        </Link>
      </div>
    </div>
  );
}

// 加载状态组件
function ErrorLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md text-center">
        <h1 className="mb-4 text-xl font-medium">Loading...</h1>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}

// 主页面组件，使用Suspense包裹内容组件
export default function ErrorPage() {
  return (
    <Suspense fallback={<ErrorLoading />}>
      <ErrorContent />
    </Suspense>
  );
} 