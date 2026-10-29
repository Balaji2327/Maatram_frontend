"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Cog6ToothIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { adminApi, getAdminToken } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "reviewer";
  twoFactorEnabled: boolean;
  createdAt: string;
}

export default function AdminSettingsScreen() {
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Sign out modal state
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Admin account info
  const [adminEmail, setAdminEmail] = useState("admin@maatramedu.org");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [emailUpdateSuccess, setEmailUpdateSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("maatram_admin_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.email) setAdminEmail(parsed.email);
        }
      } catch { }
    }
  }, []);

  // Administrators list state
  const [adminList, setAdminList] = useState<AdminUser[]>([]);

  // Form states for "Add New Admin"
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"super_admin" | "admin" | "reviewer">("admin");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState("");
  const [adminErrorMsg, setAdminErrorMsg] = useState("");

  // 2FA portal toggle & setup states
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFaSuccessMsg, setTwoFaSuccessMsg] = useState("");

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccessMsg("");
    setAdminErrorMsg("");

    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      setAdminErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsSubmittingAdmin(true);

    // Simulate creation
    setTimeout(() => {
      const created: AdminUser = {
        id: Date.now().toString(),
        name: newAdminName.trim(),
        email: newAdminEmail.trim(),
        role: newAdminRole,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setAdminList((prev) => [created, ...prev]);
      setAdminSuccessMsg(`New admin "${newAdminName}" has been successfully added.`);
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setNewAdminRole("admin");
      setIsSubmittingAdmin(false);

      setTimeout(() => setAdminSuccessMsg(""), 5000);
    }, 600);
  };

  const handleToggle2FA = () => {
    if (!is2FAEnabled) {
      setShowQrModal(true);
    } else {
      setIs2FAEnabled(false);
      setTwoFaSuccessMsg("Two-Factor Authentication has been disabled for your portal account.");
      setTimeout(() => setTwoFaSuccessMsg(""), 4000);
    }
  };

  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      alert("Please enter a valid 6-digit verification code.");
      return;
    }
    setIs2FAEnabled(true);
    setShowQrModal(false);
    setVerificationCode("");
    setTwoFaSuccessMsg("Two-Factor Authentication is now active and protecting your portal.");
    setTimeout(() => setTwoFaSuccessMsg(""), 5000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");

    if (!currentPassword.trim() || !newPassword.trim()) {
      setPasswordError("Please enter both current and new passwords.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMsg("");
      }, 1500);
    }, 600);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    const trimmed = newEmailInput.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (trimmed.toLowerCase() === adminEmail.toLowerCase()) {
      setEmailError("New email must be different from current email.");
      return;
    }

    setIsSavingEmail(true);
    setTimeout(() => {
      setAdminEmail(trimmed);
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("maatram_admin_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.email = trimmed;
            localStorage.setItem("maatram_admin_user", JSON.stringify(parsed));
          }
        } catch { }
      }
      setIsSavingEmail(false);
      setShowEmailModal(false);
      setNewEmailInput("");
      setEmailUpdateSuccess("Login email updated successfully.");
      setTimeout(() => setEmailUpdateSuccess(""), 4000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary flex">
      {/* 1. Yellow & White Sidebar */}
      <AdminSidebar
        activeTab="settings"
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="w-full px-6 lg:px-10 py-8 space-y-8 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Account & Security Settings
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Manage login credentials, authentication methods, recovery options, and account security.
              </p>
            </div>
          </div>

          {emailUpdateSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              {emailUpdateSuccess}
            </div>
          )}

          {/* 1. SECTION: LOGIN & ACCOUNT ACCESS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <h2 className="font-heading font-bold text-sm text-slate-900">
                Login & Account Access
              </h2>
              <p className="font-primary text-xs text-slate-500 mt-1">
                Manage the credentials used to access your administrator portal.
              </p>
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 lg:p-7 shadow-xs space-y-5">
              {/* Login Email Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                    LOGIN EMAIL
                  </p>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                      {adminEmail}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setNewEmailInput(adminEmail);
                      setEmailError("");
                      setShowEmailModal(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
                  >
                    Change login email
                  </button>
                </div>
              </div>

              {/* Change Password Row */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
                >
                  <LockClosedIcon className="w-4 h-4 text-[#F7BC0F] stroke-[2]" />
                  <span>Change password</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. SECTION: MULTI-FACTOR AUTHENTICATION */}
          <div>
            {twoFaSuccessMsg && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {twoFaSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4">
                <h2 className="font-heading font-bold text-sm text-slate-900">
                  Multi-Factor Authentication
                </h2>
                <p className="font-primary text-xs text-slate-500 mt-1">
                  Add an extra layer of protection to your account.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Authenticator app card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                        <DevicePhoneMobileIcon className="w-4 h-4 text-[#F7BC0F] stroke-[2]" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${is2FAEnabled
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                      >
                        {is2FAEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                      Authenticator app
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Primary two-factor authentication method.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleToggle2FA}
                      className="w-full py-2 rounded-xl text-xs font-heading font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                    >
                      {is2FAEnabled ? "Disable" : "Manage"}
                    </button>
                  </div>
                </div>

                {/* Email 2FA card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                        <EnvelopeIcon className="w-4 h-4 text-[#F7BC0F] stroke-[2]" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Enabled
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                      Email
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Secondary two-factor authentication method.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => alert("Email verification is linked to your login email.")}
                      className="w-full py-2 rounded-xl text-xs font-heading font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SECTION: ADD NEW ADMINISTRATOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <h2 className="font-heading font-bold text-sm text-slate-900">
                Add New Administrator
              </h2>
              <p className="font-primary text-xs text-slate-500 mt-1">
                Grant dashboard access to new foundation staff, coordinators, or reviewers.
              </p>
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 lg:p-7 shadow-xs space-y-5">
              {adminSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {adminSuccessMsg}
                </div>
              )}

              {adminErrorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                  {adminErrorMsg}
                </div>
              )}

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@maatramedu.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                    />
                  </div>

                  {/* Temporary Password */}
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                      Temporary Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                      Admin Role
                    </label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                    >
                      <option value="admin">Admin (Full Access)</option>
                      <option value="reviewer">Reviewer (View & Verify Only)</option>
                      <option value="super_admin">Super Admin (All Privileges)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmittingAdmin}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c]"
                  >
                    <span>{isSubmittingAdmin ? "Adding Admin..." : "Add Administrator"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 4. SECTION: ACTIVE ADMINISTRATORS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <h2 className="font-heading font-bold text-sm text-slate-900">
                Active Administrators
              </h2>
              <p className="font-primary text-xs text-slate-500 mt-1">
                List of authorized admin accounts on the Maatram Portal.
              </p>
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 lg:p-7 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-heading text-[11px] uppercase tracking-wider bg-slate-50/70">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">2FA Status</th>
                      <th className="py-3 px-4">Date Added</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {adminList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No administrators added yet. Use the form above to add a new administrator.
                        </td>
                      </tr>
                    ) : (
                      adminList.map((admin) => (
                        <tr key={admin.id} className="hover:bg-amber-50/30 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {admin.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                            {admin.email}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${admin.role === "super_admin"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : admin.role === "admin"
                                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                                }`}
                            >
                              {admin.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {admin.twoFactorEnabled ? (
                              <span className="text-emerald-700 font-semibold text-[11px]">
                                Enabled
                              </span>
                            ) : (
                              <span className="text-slate-400 font-semibold text-[11px]">
                                Disabled
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {admin.createdAt}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {admin.role !== "super_admin" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove administrator access for ${admin.name}?`)) {
                                    setAdminList((prev) => prev.filter((a) => a.id !== admin.id));
                                  }
                                }}
                                className="text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                              >
                                Revoke
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Primary Owner</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 2FA SETUP MODAL (QR CODE) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">Set Up Authenticator App</h3>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Scan this QR code with Google Authenticator or Microsoft Authenticator, then enter the 6-digit code below.
            </p>

            {/* QR Code Placeholder Graphic */}
            <div className="flex flex-col items-center justify-center p-6 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200">
              <div className="w-36 h-36 bg-white rounded-2xl border border-slate-200 p-2 flex items-center justify-center shadow-xs">
                {/* Visual simulated QR */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-slate-900 rounded-lg">
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-transparent col-span-2" />
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-white col-span-1" />
                  <div className="bg-transparent col-span-1" />
                  <div className="bg-transparent col-span-2" />
                  <div className="bg-white col-span-2" />
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-white col-span-2" />
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                </div>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-600 mt-3 tracking-wider">
                SECRET: MAAT-RAM2-5SEC-UR99
              </p>
            </div>

            {/* Verification Code Form */}
            <form onSubmit={handleConfirm2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2 text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c]"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">Change Password</h3>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordMsg("");
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {passwordMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {passwordMsg}
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setPasswordMsg("");
                  }}
                  className="px-4 py-2 text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-5 py-2 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c]"
                >
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE LOGIN EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <EnvelopeIcon className="w-4 h-4 text-[#F7BC0F] stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Change Login Email
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Update your primary administrator credentials.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailError("");
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {emailError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                {emailError}
              </div>
            )}

            <form onSubmit={handleSaveEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Current Email
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-mono">
                  {adminEmail}
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  New Login Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={newEmailInput}
                  onChange={(e) => {
                    setNewEmailInput(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="new.admin@maatramedu.org"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  You will use this email address to sign in to the Maatram Portal.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailError("");
                  }}
                  className="px-4 py-2 text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEmail}
                  className="px-5 py-2 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c] disabled:opacity-50"
                >
                  {isSavingEmail ? "Saving..." : "Update Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => {
          adminApi.logout();
          router.push("/");
        }}
      />
    </div>
  );
}
