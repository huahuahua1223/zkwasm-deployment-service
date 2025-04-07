"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError("The passwords you entered do not match");
      setIsLoading(false);
      return;
    }

    // 验证密码长度
    if (formData.password.length < 6) {
      setError("The password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // 验证用户名长度
    if (formData.username.length < 3) {
      setError("The username must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(data.message || "Registration successful, please check your email to verify your account");
      
      // 清空表单
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        email: "",
      });
      
      // 5秒后跳转到登录页
      setTimeout(() => {
        router.push('/auth/signin?registered=true');
      }, 5000);
    } catch (error) {
      console.error("Registration error", error);
      setError(error instanceof Error ? error.message : "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Register an account</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
            <p>{success}</p>
            <p className="mt-2 text-sm">You will be automatically redirected to the login page in 5 seconds</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
              required
              minLength={3}
              maxLength={20}
              placeholder="At least 3 characters, up to 20 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
              required
              placeholder="Your real name or nickname"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
              required
              placeholder="For account verification and password retrieval"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="password">
              Password
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
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="confirmPassword">
              Confirm Password
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
              placeholder="Enter the password again"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success !== ""}
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>Already have an account? <Link href="/auth/signin" className="text-blue-600 hover:underline">Login</Link></p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>By registering, you agree to our terms of service and privacy policy.</p>
          <p className="mt-1">After registration, you will receive a verification email. Please click the link in the email to activate your account.</p>
        </div>
      </div>
    </div>
  );
} 