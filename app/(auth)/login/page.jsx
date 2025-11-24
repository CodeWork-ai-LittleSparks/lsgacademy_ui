"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/authContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        // Check if password change is required
        if (result.requirePasswordChange) {
          router.push("/change-password");
          return;
        }
        
        // Login successful - authContext will handle role-based redirect
        return;
      } else {
        // Handle different error codes
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
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EA580C] via-[#C2410C] to-[#F59E0B] animate-gradient-shift"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#E9B3FB] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF1F1] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-20 w-96 h-96 bg-[#6F00FF] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Left Side - Login Form */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Glassmorphism Card */}
          <div className="relative bg-white/10 backdrop-blur-2xl p-10 rounded-3xl border border-white/20 shadow-2xl shadow-black/20">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#EA580C] to-[#F59E0B] rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative">
              {/* Logo/Brand with animation */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#EA580C] to-[#F59E0B] rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-xl">YourBrand</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-white/70 text-sm">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm animate-shake">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* Email Input with floating label effect */}
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-[#FDBA74] focus:bg-white/20 transition-all duration-300"
                  />
                  <label className="absolute left-4 -top-2.5 bg-gradient-to-r from-[#EA580C] to-[#F59E0B] px-2 py-0.5 rounded text-xs font-medium text-white transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-gradient-to-r peer-focus:from-[#EA580C] peer-focus:to-[#F59E0B]">
                    Email Address
                  </label>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-300 flex items-center gap-1 animate-fade-in">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Input with toggle visibility */}
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="peer w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-[#FDBA74] focus:bg-white/20 transition-all duration-300"
                  />
                  <label className="absolute left-4 -top-2.5 bg-gradient-to-r from-[#EA580C] to-[#F59E0B] px-2 py-0.5 rounded text-xs font-medium text-white transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-gradient-to-r peer-focus:from-[#EA580C] peer-focus:to-[#F59E0B]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-300 flex items-center gap-1 animate-fade-in">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-2 border-white/30 bg-white/10 checked:bg-gradient-to-r checked:from-[#6F00FF] checked:to-[#E9B3FB] focus:ring-2 focus:ring-[#E9B3FB] transition-all"
                    />
                    <span className="text-white/70 group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-[#FDBA74] hover:text-[#FFEDD5] font-medium transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In Button with ripple effect */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full bg-gradient-to-r from-[#EA580C] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#EA580C] text-white font-bold py-4 px-6 rounded-xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#FDBA74]/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-white/70">
                Need help? Contact your administrator
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative z-10 p-12">
        {/* Decorative Floating Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-[#E9B3FB]/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#FFF1F1]/30 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-float animation-delay-4000"></div>

        {/* Character Illustration Container - LARGER */}
        <div className="relative z-10 w-full h-full flex items-center justify-center animate-fade-in-up animation-delay-500">
          <div className="relative group w-full max-w-2xl">
            {/* Main 3D Character - Use a better illustration */}
            <div className="relative w-full h-[600px] flex items-center justify-center">
              <img 
                src="https://cdni.iconscout.com/illustration/premium/thumb/user-account-sign-up-illustration-download-in-svg-png-gif-file-formats--login-form-interface-pack-design-development-illustrations-4703625.png?f=webp" 
                alt="Welcome illustration"
                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Animated Floating Elements Around Character - BIGGER */}
            <div className="absolute -top-16 -right-16 w-28 h-28 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full shadow-2xl flex items-center justify-center animate-bounce-slow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <div className="absolute top-24 -left-16 w-24 h-24 bg-gradient-to-r from-lime-300 to-green-300 rounded-full shadow-2xl flex items-center justify-center animate-bounce-slow animation-delay-1000">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="absolute -bottom-10 right-28 w-20 h-20 bg-gradient-to-r from-orange-300 to-red-300 rounded-full shadow-2xl flex items-center justify-center animate-bounce-slow animation-delay-2000">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="absolute bottom-40 -right-10 w-24 h-24 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full shadow-2xl flex items-center justify-center animate-bounce-slow animation-delay-3000">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>

            {/* Glowing rings around character */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-4 border-white/10 rounded-full animate-pulse-ring"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-white/5 rounded-full animate-pulse-ring animation-delay-1000"></div>
          </div>
        </div>

        {/* Additional decorative particles - BIGGER */}
        <div className="absolute top-32 right-32 w-6 h-6 bg-lime-400 rounded-full animate-ping-slow"></div>
        <div className="absolute top-48 right-48 w-5 h-5 bg-yellow-400 rounded-full animate-ping-slow animation-delay-1000"></div>
        <div className="absolute bottom-40 left-40 w-7 h-7 bg-orange-400 rounded-full animate-ping-slow animation-delay-2000"></div>
        <div className="absolute bottom-64 right-64 w-5 h-5 bg-pink-400 rounded-full animate-ping-slow animation-delay-3000"></div>
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-1/4 left-12 w-16 h-16 border-4 border-[#E9B3FB]/30 rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-12 w-20 h-20 border-4 border-[#FFF1F1]/30 rounded-full animate-spin-reverse"></div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
            opacity: 0.9;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.1;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
