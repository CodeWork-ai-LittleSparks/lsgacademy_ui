"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/api/services/authService";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialToken = params.get("token") || params.get("reset_token") || "";
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ token: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialToken) setToken(initialToken);
  }, [initialToken]);

  const validate = () => {
    const e = { token: "", newPassword: "", confirmPassword: "" };
    if (!token) e.token = "Reset token is required";
    if (!newPassword || newPassword.length < 8) e.newPassword = "Minimum 8 characters";
    if (confirmPassword !== newPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return !e.token && !e.newPassword && !e.confirmPassword;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setMessage("");
    setError("");
    if (!validate()) return;
    setLoading(true);
    const res = await authService.resetPassword(token, newPassword, confirmPassword);
    setLoading(false);
    if (res.success) {
      setMessage("Password reset successfully");
      setTimeout(() => router.push('/login'), 1200);
    } else {
      setError(res.error || "Unable to reset password");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E97451] via-[#C85A3B] to-[#F2B7A1] animate-gradient-shift" />
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Image src="/images/logo.png" alt="LSG Academy" width={200} height={90} priority className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 text-center">Reset Password</h1>
          <p className="text-white/80 text-sm text-center mb-6">Enter your new password</p>
          {message && (
            <div className="mb-4 bg-green-500/20 border border-green-500/40 text-white px-4 py-3 rounded-xl text-sm">{message}</div>
          )}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/40 text-white px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-5">
            {!initialToken && (
              <div className="relative">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Reset Token"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-[#F2B7A1] focus:bg-white/20 transition-all"
                />
                {errors.token && <p className="mt-2 text-sm text-red-300">{errors.token}</p>}
              </div>
            )}
            <div className="relative">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-[#F2B7A1] focus:bg-white/20 transition-all"
                style={{ caretColor: "#ffffff" }}
              />
              {errors.newPassword && <p className="mt-2 text-sm text-red-300">{errors.newPassword}</p>}
            </div>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-[#F2B7A1] focus:bg-white/20 transition-all"
                style={{ caretColor: "#ffffff" }}
              />
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-300">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#E97451] to-[#F2B7A1] text-white font-semibold hover:from-[#F2B7A1] hover:to-[#E97451] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div className="mt-6 text-center space-x-4">
            <Link href="/login" className="text-[#FFD8CA] hover:text-white font-medium">Login</Link>
            <Link href="/forgot-password" className="text-[#FFD8CA] hover:text-white font-medium">Resend link</Link>
          </div>
        </div>
      </div>
    </div>
  );
}