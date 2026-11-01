"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AtSymbolIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { authApi } from "../lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams?.get("registered") === "true";
  const loginRequired = searchParams?.get("loginRequired") === "true";
  const emailParam = searchParams?.get("email") || searchParams?.get("target") || "";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.login({
        email: email.trim(),
        password: password,
      });

      if (!res.success) {
        setErrorMessage(res.message || "Invalid email or password. Please verify.");
        setIsLoading(false);
        return;
      }

      // Successful login -> Redirect to Student Dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage(err.message || "Failed to authenticate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        Student Sign In
      </h1>
      <p className="font-primary text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 text-center">
        Sign in with your registered email and password to access your scholarship portal.
      </p>

      {/* Registration Success Banner */}
      {registered && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 animate-in fade-in duration-300">
          <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            <span className="font-bold">Account created successfully!</span> Please sign in below with your credentials to access your dashboard.
          </p>
        </div>
      )}

      {/* Login Required Notice */}
      {loginRequired && !registered && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 text-center font-medium">
          Please sign in to access the scholarship application portal.
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-600 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleLogin} className="mt-6 space-y-4" autoComplete="off">
        {/* Email Address */}
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
              autoComplete="email"
              placeholder="scholar.name@example.com"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
            />
          </div>
        </div>

        {/* Password */}
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
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer mt-5 border border-[#e5ad0c] disabled:opacity-70"
        >
          <span>{isLoading ? "Signing in..." : "Sign In to Dashboard"}</span>
          <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* Sign Up & Administrator Links */}
        <div className="text-center pt-3 border-t border-slate-100 space-y-2">
          <div>
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
          <div className="pt-1">
            <Link
              href="/"
              className="font-primary text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Administrator Portal Sign In →
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function LoginScreen() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-primary selection:bg-[#F7BC0F] selection:text-black relative overflow-hidden">
      {/* Soft warm ambient blur in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F7BC0F]/15 rounded-full blur-[140px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-10 shadow-xl text-center text-slate-600 text-sm">
            Loading sign in...
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}
