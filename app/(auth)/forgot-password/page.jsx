"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/services/authService";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    setEmailError("");
    if (!email) { setEmailError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Enter a valid email"); return false; }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!validate()) return;
    setLoading(true);
    const res = await authService.forgotPassword(email);
    setLoading(false);
    if (res.success) {
      setMessage("If your email exists, check your inbox for a reset link.");
    } else {
      setError(res.error || "Unable to process request");
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
          <h1 className="text-3xl font-bold text-white mb-1 text-center">Forgot Password</h1>
          <p className="text-white/80 text-sm text-center mb-6">Enter your email to receive a password reset link</p>
          {message && (
            <div className="mb-4 bg-green-500/20 border border-green-500/40 text-white px-4 py-3 rounded-xl text-sm">{message}</div>
          )}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/40 text-white px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-[#F2B7A1] focus:bg-white/20 transition-all"
                style={{ caretColor: "#ffffff" }}
              />
              {emailError && <p className="mt-2 text-sm text-red-300">{emailError}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#E97451] to-[#F2B7A1] text-white font-semibold hover:from-[#F2B7A1] hover:to-[#E97451] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-[#FFD8CA] hover:text-white font-medium">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}