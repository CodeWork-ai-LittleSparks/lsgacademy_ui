"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/authContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const okLocal = validate();
    if (!okLocal) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (result.requirePasswordChange) {
          router.push("/change-password");
          return;
        }
        return;
      } else {
        switch (result.code) {
          case 'INVALID_CREDENTIALS':
            setError("Invalid email or password. Please try again.");
            break;
          case 'ACCOUNT_INACTIVE':
            setError("Your account is inactive. Please contact support.");
            break;
          case 'PASSWORD_CHANGE_REQUIRED':
            router.push("/change-password");
            return;
          default:
            setError(result.error || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Image with Brand Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/loginImage.jpg"
          alt="LSG Academy — learning in action"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-secondary/60 to-secondary/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-3">LSG Academy</h1>
          <p className="text-lg text-white/90">
            Empowering educators and students with modern learning tools.
          </p>
          <p className="mt-2 text-sm text-white/80">
            Manage classes, track performance, and drive academic excellence.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sign in to LSG Academy</h1>
            <p className="mt-1 text-sm text-gray-600">Access your dashboard, manage classes, and track progress.</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary hover:text-primary-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400">
              © 2025 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
