"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function OtpVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params with safe optional chaining
  const authType = searchParams?.get("type") || "login"; // "login" | "signup"
  const target = searchParams?.get("target") || "+91 98765 43210";
  const email = searchParams?.get("email") || "";
  const studentName = searchParams?.get("name") || "";

  // State
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first OTP field on mount
  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle digit changes
  const handleOtpChange = (index: number, value: string) => {
    setErrorMessage("");
    const digitsOnly = value.replace(/\D/g, "");

    // If multiple digits were pasted
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

    // Auto-advance
    if (singleDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Keyboard navigation & backspace
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

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setInfoMessage(`A fresh verification code has been sent to ${target}`);
    setErrorMessage("");
    otpInputRefs.current[0]?.focus();
  };

  // Verify OTP Form
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join("");
    if (enteredCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsVerifying(false);
      if (authType === "signup") {
        setIsSuccess(true);
      } else {
        router.push("/dashboard");
      }
    }, 800);
  };

  const backUrl = authType === "signup" ? "/signup" : "/";

  return (
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

      {isSuccess ? (
        /* SignUp Success State */
        <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-[#F7BC0F]/50 flex items-center justify-center mx-auto text-[#F7BC0F] shadow-sm">
            <CheckCircleIcon className="w-10 h-10 text-[#F7BC0F]" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-4">
            Account Verified!
          </h2>
          <p className="font-primary text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            Welcome{studentName ? `, ${studentName}` : ""}! Your contact details have been successfully verified with Maatram Foundation.
          </p>

          <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700 text-left space-y-1.5">
            <div>
              <span className="text-slate-500 font-medium">Verified Contact:</span>{" "}
              <span className="font-bold text-slate-900">{target}</span>
            </div>
            {email && (
              <div>
                <span className="text-slate-500 font-medium">Email:</span>{" "}
                <span className="font-bold text-slate-900">{email}</span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center gap-2 w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl transition shadow-md shadow-[#F7BC0F]/30 border border-[#e5ad0c] cursor-pointer"
            >
              <span>Proceed to Scholarship Application</span>
              <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-slate-900 transition"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      ) : (
        /* OTP Input State */
        <div>
          {/* Header */}
          <div className="text-center">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Verify OTP
            </h1>
            <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1.5">
              {authType === "signup"
                ? "Enter the 6-digit code sent to verify your contact information:"
                : "Enter the 6-digit verification code sent to:"}
            </p>

            {/* Recipient Display with Edit Option */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full mt-2 text-xs font-semibold text-slate-800">
              <span>{target}</span>
              <Link
                href={backUrl}
                className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-bold underline ml-1 cursor-pointer"
                title="Change contact details"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            </div>
          </div>

          {/* Info or Error alert */}
          {infoMessage && !errorMessage && (
            <div className="mt-4 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-center text-xs text-amber-800 font-medium">
              {infoMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-600 font-medium">
              {errorMessage}
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
            {/* 6 Individual Digit Inputs */}
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

            {/* Resend OTP Section */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">
                {resendTimer > 0 ? (
                  <>
                    Resend code in <span className="font-bold text-slate-800">{resendTimer}s</span>
                  </>
                ) : (
                  "Didn't receive the code?"
                )}
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`inline-flex items-center gap-1 font-bold transition cursor-pointer ${
                  canResend
                    ? "text-slate-900 hover:text-[#F7BC0F] underline"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer border border-[#e5ad0c] disabled:opacity-70"
              >
                <span>
                  {isVerifying
                    ? "Verifying code..."
                    : authType === "signup"
                    ? "Verify & Complete Registration"
                    : "Verify & Sign In"}
                </span>
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              <Link
                href={backUrl}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>
                  {authType === "signup"
                    ? "Back to registration details"
                    : "Change mobile or email"}
                </span>
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function OtpVerificationScreen() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-primary selection:bg-[#F7BC0F] selection:text-black relative overflow-hidden">
      {/* Soft warm ambient blur in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F7BC0F]/15 rounded-full blur-[140px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-10 shadow-xl text-center text-slate-600 text-sm">
            Loading verification page...
          </div>
        }
      >
        <OtpVerificationContent />
      </Suspense>
    </main>
  );
}
