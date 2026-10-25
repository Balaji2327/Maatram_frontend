"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { adminApi } from "../lib/api";

export default function AdminLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both username/email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminApi.login({
        email: email.trim(),
        password: password.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.message || "Invalid admin credentials.");
        setIsLoading(false);
        return;
      }

      // Navigate to Admin Dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate with management server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@maatram.org");
    setPassword("admin@maatram2026");
    setErrorMessage("");
  };

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-primary selection:bg-[#F7BC0F] selection:text-black relative overflow-hidden">
      {/* Soft warm ambient blur in background identical to Student Login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F7BC0F]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Admin White Card */}
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/60 relative z-10 transition-all duration-300">
        {/* Brand Logo & Administrative Portal Badge */}
        <div className="flex flex-col items-center justify-center mb-4">
          <Link href="/" className="group transition-transform active:scale-95 cursor-pointer focus:outline-none mb-3">
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
          Admin Sign In
        </h1>
        <p className="font-primary text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 text-center">
          Authorized personnel access to view and manage student scholarship applications.
        </p>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-center text-xs text-red-600 font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* Demo Credentials Quick Fill Banner */}
        <div className="mt-5 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Demo Admin Access</p>
              <p className="text-[11px] text-amber-800">
                admin@maatram.org <span className="opacity-40">|</span> admin@maatram2026
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1.5 bg-[#F7BC0F] hover:bg-[#e5ad0c] text-slate-950 text-[11px] font-bold rounded-lg transition shadow-xs cursor-pointer whitespace-nowrap border border-[#e5ad0c]"
          >
            Fill Demo
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
          {/* Admin Email / Username */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 tracking-wide uppercase">
              Admin Email or Username
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@maatram.org"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#F7BC0F] focus:ring-4 focus:ring-[#F7BC0F]/20 transition font-primary"
              />
            </div>
          </div>

          {/* Admin Password */}
          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 tracking-wide uppercase">
              Admin Password
            </label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LockClosedIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#F7BC0F] focus:ring-4 focus:ring-[#F7BC0F]/20 transition font-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer mt-6 border border-[#e5ad0c] disabled:opacity-70"
          >
            <span>{isLoading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Back to Student Portal Link */}
          <div className="text-center pt-4 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Back to Student Portal</span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
