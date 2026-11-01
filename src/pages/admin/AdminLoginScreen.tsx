"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LockClosedIcon,
  AtSymbolIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { adminApi } from "../../lib/api";

export default function AdminLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Guarantee fields are completely empty whenever the admin arrives on the login page
  useEffect(() => {
    setEmail("");
    setPassword("");
    setOtp(["", "", "", "", "", ""]);
    setRequires2FA(false);
    setErrorMessage("");
    setInfoMessage("");
    if (typeof window !== "undefined") {
      adminApi.logout();
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    const enteredOtp = otp.join("");
    if (requires2FA && enteredOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit authentication code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminApi.login({
        email: email.trim(),
        password: password.trim(),
        otp: requires2FA ? enteredOtp : undefined,
      });

      if (res.requires2FA) {
        setRequires2FA(true);
        setErrorMessage("");
        setInfoMessage("Two-factor authentication required. Enter the 6-digit code from your authenticator app.");
        setIsLoading(false);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
        return;
      }

      if (!res.success) {
        setErrorMessage(res.message || "Invalid credentials. Please verify and try again.");
        setIsLoading(false);
        return;
      }

      // Navigate to Admin Dashboard upon successful authentication
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate with management server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    setErrorMessage("");
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digitsOnly[i] || "";
      }
      setOtp(newOtp);
      const nextFocus = Math.min(digitsOnly.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const singleDigit = digitsOnly.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    if (singleDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-primary selection:bg-[#F7BC0F] selection:text-black relative overflow-hidden">
      {/* Soft warm ambient blur in background identical to Student Login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F7BC0F]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/60 relative z-10 transition-all duration-300">
        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center mb-4">
          <Link href="/" className="group transition-transform active:scale-95 cursor-pointer focus:outline-none" title="Maatram Foundation">
            <Image
              src="/assets/images/logo.png"
              alt="Maatram Foundation"
              width={160}
              height={80}
              priority
              className="h-14 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight text-center">
          {requires2FA ? "Enter Authentication Code" : "Admin Sign In"}
        </h1>
        <p className="font-primary text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 text-center">
          {requires2FA
            ? "Enter the 6-digit two-factor verification code to access the management portal:"
            : "Authorized personnel access to view and manage student scholarship applications."}
        </p>

        {/* Info & Error Messages */}
        {infoMessage && !errorMessage && (
          <div className="mt-4 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-center text-xs text-amber-900 font-medium animate-in fade-in">
            {infoMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-600 font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="mt-6 space-y-4" autoComplete="off">
          {!requires2FA ? (
            <>
              {/* Admin Email */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 tracking-wide">
                  Registered Email Address
                </label>
                <div className="relative mt-1.5">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AtSymbolIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    placeholder="admin@maatram.com"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
                  />
                </div>
              </div>

              {/* Admin Password */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 tracking-wide">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockClosedIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer mt-5 border border-[#e5ad0c] disabled:opacity-70"
              >
                <span>{isLoading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            </>
          ) : (
            /* 2FA OTP Digits Form */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-heading font-extrabold text-xl sm:text-2xl rounded-xl border-2 transition-all outline-none ${
                      digit
                        ? "border-[#F7BC0F] bg-amber-50/40 text-slate-900 shadow-sm"
                        : "border-slate-200 bg-slate-50/80 text-slate-900 focus:border-[#F7BC0F] focus:bg-white focus:ring-4 focus:ring-[#F7BC0F]/20"
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer border border-[#e5ad0c] disabled:opacity-70"
                >
                  <span>{isLoading ? "Verifying..." : "Verify Code & Sign In"}</span>
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setOtp(["", "", "", "", "", ""]);
                    setErrorMessage("");
                    setInfoMessage("");
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5" />
                  <span>Back to login credentials</span>
                </button>
              </div>
            </div>
          )}

          {/* Student Portal Switch Link */}
          <div className="text-center pt-3 border-t border-slate-100">
            <span className="font-primary text-xs text-slate-600">
              Are you a student applying for scholarship?{" "}
            </span>
            <Link
              href="/login"
              className="font-primary text-xs font-bold text-slate-900 hover:text-[#F7BC0F] hover:underline transition"
            >
              Student Sign In
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
