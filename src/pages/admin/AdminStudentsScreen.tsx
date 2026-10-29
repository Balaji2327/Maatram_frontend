"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { getAdminToken } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";

export default function AdminStudentsScreen() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary flex">
      {/* 1. Yellow & White Sidebar */}
      <AdminSidebar
        activeTab="students"
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="w-full px-6 lg:px-10 py-8 space-y-8 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Students
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Directory of currently supported and active scholarship students.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students by name, reg no, or branch..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white transition"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-heading font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
              >
                <FunnelIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Clean Layout Container - No Dummy Data */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-heading text-[11px] uppercase tracking-wider bg-slate-50/70">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">College</th>
                    <th className="py-3 px-4">Degree & Year</th>
                    <th className="py-3 px-4">Scholarship Batch</th>
                    <th className="py-3 px-4">Academic Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <UserGroupIcon className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                      <p className="text-sm font-semibold text-slate-600">No Student Records Yet</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Active student profiles will be listed here once applications are approved.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => router.push("/")}
      />
    </div>
  );
}
