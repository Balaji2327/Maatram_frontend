"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DevicePhoneMobileIcon,
  AtSymbolIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function LoginScreen() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [identifier, setIdentifier] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!identifier.trim()) {
      setErrorMessage(
        authMethod === "phone"
          ? "Please enter your mobile number"
          : "Please enter your email address"
      );
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      // Route to dedicated OTP verification page
      router.push(`/verify-otp?type=login&target=${encodeURIComponent(identifier.trim())}`);
    }, 600);
  };

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-primary selection:bg-[#F7BC0F] selection:text-black relative overflow-hidden">
      {/* Soft warm ambient blur in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F7BC0F]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Centered White Card */}
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/60 relative z-10 transition-all duration-300">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/assets/images/logo.png"
            alt="Maatram Foundation"
            width={160}
            height={80}
            priority
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight text-center">
          Student Sign In
        </h1>
        <p className="font-primary text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 text-center">
          Login securely using a One-Time Password (OTP) sent to your registered phone or email. No password needed!
        </p>

        {/* Auth Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mt-6">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setErrorMessage("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
              authMethod === "phone"
                ? "bg-white text-slate-900 border border-slate-200/90 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <DevicePhoneMobileIcon
              className={`w-4 h-4 ${
                authMethod === "phone" ? "text-[#F7BC0F]" : "text-slate-500"
              }`}
            />
            <span>Mobile Number</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod("email");
              setErrorMessage("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
              authMethod === "email"
                ? "bg-white text-slate-900 border border-slate-200/90 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <AtSymbolIcon
              className={`w-4 h-4 ${
                authMethod === "email" ? "text-[#F7BC0F]" : "text-slate-500"
              }`}
            />
            <span>Email Address</span>
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Identifier Input Form */}
        <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold text-slate-800 tracking-wide">
              {authMethod === "phone"
                ? "Registered Mobile Number"
                : "Registered Email Address"}
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {authMethod === "phone" ? (
                  <DevicePhoneMobileIcon className="w-4 h-4 text-slate-400" />
                ) : (
                  <AtSymbolIcon className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <input
                type={authMethod === "phone" ? "tel" : "email"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder={
                  authMethod === "phone"
                    ? "+91 98765 43210"
                    : "scholar.name@example.com"
                }
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
              />
            </div>
            <p className="font-primary text-[11px] text-slate-500 mt-1.5">
              {authMethod === "phone"
                ? "We will send a 6-digit verification code via SMS."
                : "We will send a 6-digit verification code to your email."}
            </p>
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={isSendingOtp}
            className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer mt-5 border border-[#e5ad0c] disabled:opacity-70"
          >
            <span>{isSendingOtp ? "Sending OTP..." : "Get Login OTP"}</span>
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-3 border-t border-slate-100">
            <span className="font-primary text-xs text-slate-600">
              New applicant or haven&apos;t registered yet?{" "}
            </span>
            <Link
              href="/signup"
              className="font-primary text-xs font-bold text-slate-900 hover:text-[#F7BC0F] hover:underline transition"
            >
              Create an Account
            </Link>
          </div>
        </form>

      </div>
    </main>
  );
}
