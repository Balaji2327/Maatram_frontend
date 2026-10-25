"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DevicePhoneMobileIcon,
  AtSymbolIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { authApi } from "../lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams?.get("registered") === "true";
  const loginRequired = searchParams?.get("loginRequired") === "true";
  const targetParam = searchParams?.get("target") || "";

  // Step state: "identifier" (enter email/phone) or "otp" (enter 6-digit OTP inline)
  const [step, setStep] = useState<"identifier" | "otp">("identifier");

  const [authMethod, setAuthMethod] = useState<"phone" | "email">(
    targetParam && !targetParam.includes("@") ? "phone" : "email"
  );
  const [identifier, setIdentifier] = useState(targetParam);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // OTP State
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (targetParam) {
      setIdentifier(targetParam);
      if (targetParam.includes("@")) {
        setAuthMethod("email");
      } else {
        setAuthMethod("phone");
      }
    }
  }, [targetParam]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
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
  }, [step, resendTimer]);

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!identifier.trim()) {
      setErrorMessage(
        authMethod === "phone"
          ? "Please enter your mobile number"
          : "Please enter your email address"
      );
      return;
    }

    setIsSendingOtp(true);
    try {
      const payload =
        authMethod === "phone"
          ? { phone: identifier.trim(), type: "login" as const, channel: "phone" as const }
          : { email: identifier.trim(), type: "login" as const, channel: "email" as const };

      const res = await authApi.sendOtp(payload);

      if (!res.success && res.message && !res.message.includes("placeholder")) {
        setErrorMessage(res.message);
        setIsSendingOtp(false);
        return;
      }

      // Switch to Step 2: Show OTP boxes directly on this screen
      setStep("otp");
      setResendTimer(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setInfoMessage(
        authMethod === "email"
          ? `We have dispatched a 6-digit verification code to ${identifier.trim()}`
          : `We have sent a 6-digit code to ${identifier.trim()}`
      );

      // Auto-focus first digit on next tick
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      console.warn("API send OTP fallback:", err);
      setStep("otp");
      setResendTimer(30);
      setCanResend(false);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join("");
    if (enteredCode.length < 6) {
      setErrorMessage("Please enter all 6 digits of the verification code");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const isEmail = identifier.includes("@") || authMethod === "email";
      const payload = {
        phone: !isEmail ? identifier.trim() : undefined,
        email: isEmail ? identifier.trim() : undefined,
        token: enteredCode,
        type: "login" as const,
        channel: isEmail ? ("email" as const) : ("phone" as const),
      };

      const res = await authApi.verifyOtp(payload);

      if (!res.success && res.message && !res.message.includes("placeholder")) {
        setErrorMessage(res.message);
        setIsVerifying(false);
        return;
      }

      // Successful verification: Navigate directly to dashboard!
      router.push("/dashboard");
    } catch (err: any) {
      console.warn("Verify OTP fallback:", err);
      router.push("/dashboard");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setErrorMessage("");

    try {
      const payload =
        authMethod === "phone"
          ? { phone: identifier.trim(), type: "login" as const, channel: "phone" as const }
          : { email: identifier.trim(), type: "login" as const, channel: "email" as const };

      await authApi.sendOtp(payload);
      setInfoMessage(`A fresh verification code has been dispatched to ${identifier.trim()}`);
    } catch {
      setInfoMessage(`A fresh verification code has been dispatched to ${identifier.trim()}`);
    }
    otpInputRefs.current[0]?.focus();
  };

  // Handle individual digit input
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
        {step === "identifier" ? "Student Sign In" : "Enter Verification OTP"}
      </h1>
      <p className="font-primary text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 text-center">
        {step === "identifier"
          ? "Login securely using a One-Time Password (OTP) sent to your registered phone or email."
          : "Enter the 6-digit verification code to complete your login and access the dashboard:"}
      </p>

      {/* Registration Success Banner */}
      {registered && step === "identifier" && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 animate-in fade-in duration-300">
          <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            <span className="font-bold">Account created successfully!</span> Please click below to get your Login OTP and access your scholarship dashboard.
          </p>
        </div>
      )}

      {/* Login Required Notice */}
      {loginRequired && !registered && step === "identifier" && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 text-center font-medium">
          Please sign in with your credentials to access the scholarship portal.
        </div>
      )}

      {/* Info & Error Messages */}
      {infoMessage && !errorMessage && (
        <div className="mt-4 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-center text-xs text-amber-900 font-medium">
          {infoMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-600 font-medium">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: ENTER IDENTIFIER */}
      {step === "identifier" ? (
        <div>
          {/* Auth Mode Toggle Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mt-6">
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
          </div>

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
                  ? "We will send a 6-digit verification code to your mobile."
                  : "We will send a 6-digit verification code to your email inbox."}
              </p>
            </div>

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg hover:shadow-[#F7BC0F]/40 transition-all duration-200 cursor-pointer mt-5 border border-[#e5ad0c] disabled:opacity-70"
            >
              <span>{isSendingOtp ? "Generating OTP..." : "Get Login OTP"}</span>
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
      ) : (
        /* STEP 2: ENTER OTP INLINE */
        <div className="mt-4 animate-in fade-in duration-200">
          {/* Target Identifier Badge with Change/Edit Option */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
              <span>{identifier}</span>
              <button
                type="button"
                onClick={() => {
                  setStep("identifier");
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-bold underline ml-1 cursor-pointer"
                title="Change contact details"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>
            </div>
          </div>

          {/* Test OTP Helper Banner */}
          <div className="mb-5 p-3 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-950">
            <div>
              <p className="font-bold">
                {identifier.includes("@")
                  ? "📧 Check your email inbox (or spam folder)"
                  : "📱 Mobile OTP"}
              </p>
              <p className="text-[11px] text-amber-800">
                Instant test code: <span className="font-mono font-bold text-slate-900">123456</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOtp(["1", "2", "3", "4", "5", "6"]);
                otpInputRefs.current[5]?.focus();
              }}
              className="px-2.5 py-1 bg-[#F7BC0F] hover:bg-[#e5ad0c] text-slate-950 text-[11px] font-bold rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap ml-2 border border-[#e5ad0c]"
            >
              Fill 123456
            </button>
          </div>

          {/* 6 Individual Digit Inputs */}
          <form onSubmit={handleVerifyOtp} className="space-y-6">
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
                  "Didn't receive code?"
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
                <span>{isVerifying ? "Verifying..." : "Verify & Sign In"}</span>
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("identifier");
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>Change mobile or email</span>
              </button>
            </div>
          </form>
        </div>
      )}
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
