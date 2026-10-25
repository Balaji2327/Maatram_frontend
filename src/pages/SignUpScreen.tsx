"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  DevicePhoneMobileIcon,
  AtSymbolIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { authApi } from "../lib/api";

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
  });
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInitiateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setErrorMessage("Please enter your mobile number");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await authApi.sendOtp({
        email: formData.email.trim(),
        phone: formData.mobileNumber.trim(),
        fullName: formData.fullName.trim(),
        type: "signup",
        channel: "email",
      });

      if (!res.success && res.message && !res.message.includes("placeholder")) {
        setErrorMessage(res.message);
        setIsSendingOtp(false);
        return;
      }

      // Navigate to dedicated separate OTP page with email target
      router.push(
        `/verify-otp?type=signup&target=${encodeURIComponent(
          formData.email.trim()
        )}&email=${encodeURIComponent(
          formData.email.trim()
        )}&phone=${encodeURIComponent(
          formData.mobileNumber.trim()
        )}&name=${encodeURIComponent(formData.fullName.trim())}&channel=email`
      );
    } catch (err: any) {
      console.warn("SignUp send OTP fallback:", err);
      router.push(
        `/verify-otp?type=signup&target=${encodeURIComponent(
          formData.email.trim()
        )}&email=${encodeURIComponent(
          formData.email.trim()
        )}&phone=${encodeURIComponent(
          formData.mobileNumber.trim()
        )}&name=${encodeURIComponent(formData.fullName.trim())}&channel=email`
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-primary selection:bg-[#F7BC0F] selection:text-black relative overflow-hidden">
      {/* Soft warm ambient blur in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F7BC0F]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Expanded Centered White Card */}
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

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight text-center">
          Student Registration
        </h1>
        <p className="font-primary text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 text-center">
          Enter your basic details to register. You will receive a 6-digit verification code directly in your email. No password needed!
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleInitiateSignUp} className="mt-5 space-y-4">
          {/* Field 1: Full Name */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-800 tracking-wide">
              Student Full Name
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="e.g., Ananya Raman"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
              />
            </div>
          </div>

          {/* Field 2: Mobile Number */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-800 tracking-wide">
              Mobile Number
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <DevicePhoneMobileIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
              />
            </div>
            <p className="font-primary text-[11px] text-slate-500 mt-1">
              Used for official application correspondence and interview calls.
            </p>
          </div>

          {/* Field 3: Email Address */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-800 tracking-wide">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <AtSymbolIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="scholar.name@example.com"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
              />
            </div>
            <p className="font-primary text-[11px] text-slate-500 mt-1">
              We will send the 6-digit verification OTP to this email address.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSendingOtp}
            className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer mt-5 border border-[#e5ad0c] disabled:opacity-70"
          >
            <span>{isSendingOtp ? "Proceeding to Verification..." : "Verify & Continue"}</span>
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-3 border-t border-slate-100">
            <span className="font-primary text-xs text-slate-600">
              Already have an account?{" "}
            </span>
            <Link
              href="/"
              className="font-primary text-xs font-bold text-slate-900 hover:text-[#F7BC0F] hover:underline transition"
            >
              Sign In
            </Link>
          </div>
        </form>

      </div>
    </main>
  );
}
