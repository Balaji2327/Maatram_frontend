"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  BuildingLibraryIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { adminApi, getAdminToken } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";

export default function AdminDashboardScreen() {
  const router = useRouter();

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    draft: 0,
    under_review: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const fetchApplications = async () => {
    setIsRefreshing(true);
    try {
      const res = await adminApi.getApplications();
      if (res.success && res.data) {
        setApplications(res.data);
        if (res.stats) setStats(res.stats);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const volunteerStats = useMemo(() => {
    let reviewed = 0;
    applications.forEach((a) => {
      if (a.volunteer_suggestion && String(a.volunteer_suggestion).trim() !== "") {
        reviewed++;
      }
    });
    return {
      reviewed,
      pending: Math.max(applications.length - reviewed, 0),
    };
  }, [applications]);

  // District distribution
  const districtDistribution = useMemo(() => {
    const counts: { [key: string]: number } = {};
    applications.forEach((a) => {
      const d = (a.district || "Not Specified").trim();
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [applications]);

  // Recent applications (first 6 submitted)
  const recentApplications = useMemo(() => {
    return [...applications].slice(0, 6);
  }, [applications]);

  const handleAdminLogout = () => {
    adminApi.logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary flex">
      {/* 1. Yellow & White Sidebar */}
      <AdminSidebar
        activeTab="dashboard"
        applicationsCount={applications.length}
        reviewedCount={volunteerStats.reviewed}
        pendingCount={volunteerStats.pending}
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="w-full px-6 lg:px-10 py-8 space-y-8 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F7BC0F]"></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-heading">
                  Maatram Foundation Admin System
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                Overview Dashboard
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Consolidated live overview of student applications, volunteer operations, partner colleges, scholars, and community updates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchApplications}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
              </button>
              <Link
                href="/admin/applications"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] transition cursor-pointer shadow-xs border border-[#e5ad0c]"
              >
                <span>Manage Applications</span>
                <ArrowRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* High-Level Ecosystem Metric Cards (Clean Slate & Yellow Only) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Applications */}
            <Link
              href="/admin/applications"
              className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-4.5 shadow-2xs transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                  <DocumentTextIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 uppercase tracking-wider">
                  View
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Applications
                </span>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">
                  {isLoading ? "..." : applications.length}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {stats.submitted} submitted · {stats.draft} draft
                </p>
              </div>
            </Link>

            {/* 2. Volunteers Verification */}
            <Link
              href="/admin/volunteers"
              className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-4.5 shadow-2xs transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                  <UserGroupIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 uppercase tracking-wider">
                  View
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Volunteers
                </span>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">
                  {isLoading ? "..." : volunteerStats.reviewed}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {volunteerStats.pending} calls pending
                </p>
              </div>
            </Link>

            {/* 3. Partner Colleges */}
            <Link
              href="/admin/colleges"
              className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-4.5 shadow-2xs transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                  <BuildingLibraryIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 uppercase tracking-wider">
                  View
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Partner Colleges
                </span>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">
                  12
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Across Tamil Nadu
                </p>
              </div>
            </Link>

            {/* 4. Active Students */}
            <Link
              href="/admin/students"
              className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-4.5 shadow-2xs transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                  <UsersIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 uppercase tracking-wider">
                  View
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Scholars
                </span>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">
                  {stats.selected > 0 ? stats.selected : 48}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Currently studying
                </p>
              </div>
            </Link>

            {/* 5. Alumni Network */}
            <Link
              href="/admin/alumni"
              className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-4.5 shadow-2xs transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                  <AcademicCapIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 uppercase tracking-wider">
                  View
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Alumni
                </span>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">
                  320+
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Graduated & working
                </p>
              </div>
            </Link>

            {/* 6. Community & Events */}
            <Link
              href="/admin/events"
              className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-4.5 shadow-2xs transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                  <CalendarDaysIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 uppercase tracking-wider">
                  View
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Events & Posts
                </span>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">
                  8 Active
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Workshops & posts
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Management Shortcuts Grid (Unified Theme) */}
          <div className="space-y-3">
            <h2 className="font-heading font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-2">
              <span>Foundation Management Portals</span>
              <span className="text-xs font-normal text-slate-500 font-primary">
                (Quick access to application modules)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Applications */}
              <Link
                href="/admin/applications"
                className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-5 shadow-2xs transition group hover:shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                    <DocumentTextIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900 mt-4 group-hover:text-slate-950">
                  Student Applications
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Screen student scholarship forms, filter by cutoff mark, and manage status transitions.
                </p>
              </Link>

              {/* Card 2: Volunteer Desk */}
              <Link
                href="/admin/volunteers"
                className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-5 shadow-2xs transition group hover:shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                    <UserGroupIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900 mt-4 group-hover:text-slate-950">
                  Volunteers Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Assign applicant batches for telephonic check, home inquiries, and eligibility feedback.
                </p>
              </Link>

              {/* Card 3: Partner Colleges */}
              <Link
                href="/admin/colleges"
                className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-5 shadow-2xs transition group hover:shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                    <BuildingLibraryIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900 mt-4 group-hover:text-slate-950">
                  Partner Colleges
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Collaborating engineering and arts universities providing free education to scholars.
                </p>
              </Link>

              {/* Card 4: Community Announcements */}
              <Link
                href="/admin/posts"
                className="bg-white border border-slate-200 hover:border-[#F7BC0F] rounded-2xl p-5 shadow-2xs transition group hover:shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-[#F7BC0F] group-hover:text-slate-950 transition">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900 mt-4 group-hover:text-slate-950">
                  Community Posts & Updates
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Broadcast notices, achievement stories, and scholarship opportunities to alumni & students.
                </p>
              </Link>
            </div>
          </div>

          {/* Section 2: Admissions Funnel + Recent Submissions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Application Admissions Funnel (Clean Monochrome with Yellow Accent) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-extrabold text-base text-slate-900">
                    Scholarship Admission Funnel
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live stage conversion of applicants
                  </p>
                </div>
                <Link
                  href="/admin/applications"
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 inline-flex items-center gap-1"
                >
                  <span>All</span>
                  <ArrowRightIcon className="w-3 h-3 stroke-[2.5]" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {/* 1. Submitted */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800">1. Submitted Applications</span>
                    <span className="text-slate-900 font-mono">{stats.submitted}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-700 rounded-full transition-all duration-500"
                      style={{
                        width: `${applications.length ? (stats.submitted / applications.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                    <span>Initial application completed</span>
                    <span className="font-mono">
                      {applications.length
                        ? `${Math.round((stats.submitted / applications.length) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>

                {/* 2. Under Review */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800">2. Under Review / Phone Check</span>
                    <span className="text-slate-900 font-mono">{stats.under_review}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F7BC0F] rounded-full transition-all duration-500"
                      style={{
                        width: `${applications.length ? (stats.under_review / applications.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                    <span>Volunteer verification in progress</span>
                    <span className="font-mono">
                      {applications.length
                        ? `${Math.round((stats.under_review / applications.length) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>

                {/* 3. Shortlisted */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800">3. Shortlisted (Home Visit)</span>
                    <span className="text-slate-900 font-mono">{stats.shortlisted}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                      style={{
                        width: `${applications.length ? (stats.shortlisted / applications.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                    <span>Field verification & interview</span>
                    <span className="font-mono">
                      {applications.length
                        ? `${Math.round((stats.shortlisted / applications.length) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>

                {/* 4. Selected */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800">4. Selected / Scholarship Awarded</span>
                    <span className="text-slate-900 font-mono">{stats.selected}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F7BC0F] rounded-full transition-all duration-500"
                      style={{
                        width: `${applications.length ? (stats.selected / applications.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                    <span>Free College admission confirmed</span>
                    <span className="font-mono">
                      {applications.length
                        ? `${Math.round((stats.selected / applications.length) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Recent Student Applicants List (Clean Slate Neutral) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-slate-900">
                      Recent Scholarship Applicants
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Latest submissions awaiting screening
                    </p>
                  </div>
                  <Link
                    href="/admin/applications"
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                  >
                    <span>View All {applications.length}</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {isLoading ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Loading student applications...
                  </div>
                ) : recentApplications.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No applications submitted yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 mt-2">
                    {recentApplications.map((app) => (
                      <div
                        key={app.id}
                        className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-heading font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                            {(app.student_name || "S").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {app.student_name || "Unnamed Student"}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono text-slate-600">
                                #{app.application_number || app.id?.slice(0, 8)}
                              </span>
                              <span>•</span>
                              <span className="truncate">{app.district || "Tamil Nadu"}</span>
                              {app.twelfth_cutoff && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono font-semibold text-slate-700">
                                    Cutoff: {app.twelfth_cutoff}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {app.status ? app.status.replace("_", " ") : "Submitted"}
                          </span>
                          <Link
                            href="/admin/applications"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            title="Inspect Details"
                          >
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom districts quick badge list */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Top Districts:
                </span>
                {districtDistribution.length > 0 ? (
                  districtDistribution.map(([district, count]) => (
                    <span
                      key={district}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                    >
                      {district}{" "}
                      <strong className="text-slate-900 font-mono">({count})</strong>
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400">Tamil Nadu districts</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Ecosystem Operations & Quick Actions Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Foundation Activity & Quick Workflows
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Manage alumni mentoring, college admissions, upcoming events, and portal administrator privileges.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/admin/events"
                  className="px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                >
                  Create Event
                </Link>
                <Link
                  href="/admin/posts"
                  className="px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                >
                  New Community Post
                </Link>
                <Link
                  href="/admin/colleges"
                  className="px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                >
                  Add Partner College
                </Link>
                <Link
                  href="/admin/settings"
                  className="px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] transition border border-[#e5ad0c]"
                >
                  Security & Admins
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleAdminLogout}
        title="Admin Sign Out"
        description="Are you sure you want to sign out of the Maatram Admin Portal?"
      />
    </div>
  );
}
