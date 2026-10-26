"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  XMarkIcon,
  AcademicCapIcon,
  UserIcon,
  HomeModernIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { adminApi, getAdminToken } from "../lib/api";
import AdminChatbot from "../components/AdminChatbot";
import SignOutModal from "../components/SignOutModal";

export default function AdminDashboardScreen() {
  const router = useRouter();

  // Authentication Guard
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Data states
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
  const [errorMessage, setErrorMessage] = useState("");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "cutoff" | "name">("newest");

  // Detail View state (Full-Page Document View)
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Fetch all applications
  const fetchApplications = async () => {
    setIsRefreshing(true);
    setErrorMessage("");
    try {
      const res = await adminApi.getApplications();
      if (res.success && res.data) {
        setApplications(res.data);
        if (res.stats) setStats(res.stats);
      } else {
        setErrorMessage(res.message || "Failed to load applications");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error loading applications");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Unique district list for filter dropdown
  const districtList = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => {
      if (a.district && a.district.trim()) {
        set.add(a.district.trim());
      }
    });
    return Array.from(set).sort();
  }, [applications]);

  // Filter & Search logic
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // District filter
    if (districtFilter !== "all") {
      result = result.filter(
        (a) => a.district && a.district.toLowerCase() === districtFilter.toLowerCase()
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.full_name?.toLowerCase().includes(q) ||
          a.application_number?.toLowerCase().includes(q) ||
          a.mobile_number?.includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.district?.toLowerCase().includes(q) ||
          a.preferred_branch?.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "cutoff") {
        const cutoffA = parseFloat(a.twelfth_cutoff) || 0;
        const cutoffB = parseFloat(b.twelfth_cutoff) || 0;
        return cutoffB - cutoffA;
      }
      if (sortBy === "name") {
        return (a.full_name || "").localeCompare(b.full_name || "");
      }
      // Newest first default
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [applications, statusFilter, districtFilter, searchQuery, sortBy]);

  // Handle Status Update
  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const res = await adminApi.updateStatus(appId, newStatus);

      if (res.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
        if (selectedApplicant && selectedApplicant.id === appId) {
          setSelectedApplicant((prev: any) => ({ ...prev, status: newStatus }));
        }
        setStatusUpdateMessage(`Application status updated to ${newStatus.toUpperCase()}`);
        setTimeout(() => setStatusUpdateMessage(""), 4000);
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (err: any) {
      alert("Error updating application status: " + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) {
      alert("No applicant data to export.");
      return;
    }

    const headers = [
      "Application Number",
      "Full Name",
      "Status",
      "Mobile",
      "Email",
      "Gender",
      "District",
      "12th Cutoff",
      "12th Stream",
      "Course Preference",
      "Annual Income",
      "Siblings Count",
      "First Graduate",
      "Submission Date",
    ];

    const rows = filteredApplications.map((a) => [
      a.application_number || "",
      `"${(a.full_name || "").replace(/"/g, '""')}"`,
      a.status || "",
      a.mobile_number || "",
      a.email || "",
      a.gender || "",
      `"${(a.district || "").replace(/"/g, '""')}"`,
      a.twelfth_cutoff || "",
      `"${(a.twelfth_group || a.twelfth_stream || "").replace(/"/g, '""')}"`,
      `"${(a.preferred_degree || a.preferred_branch || "").replace(/"/g, '""')}"`,
      `"${(a.family_annual_income || a.annual_income || "").replace(/"/g, '""')}"`,
      Array.isArray(a.siblings) ? a.siblings.length : (a.siblings_count || 0),
      a.first_graduate ? "Yes" : "No",
      a.created_at ? new Date(a.created_at).toLocaleDateString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Maatram_Applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Application
  const handlePrint = () => {
    window.print();
  };

  // Sign out
  const handleAdminLogout = () => {
    adminApi.logout();
    router.push("/");
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircleIcon className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
            Draft
          </span>
        );
      case "under_review":
      case "telephonic_done":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300">
            <ClockIcon className="w-3.5 h-3.5 text-amber-600" />
            Under Review
          </span>
        );
      case "shortlisted":
      case "home_visit_done":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircleIcon className="w-3.5 h-3.5 text-purple-600" />
            Shortlisted
          </span>
        );
      case "selected":
      case "scholarship_awarded":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
            Selected
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XMarkIcon className="w-3.5 h-3.5 text-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              onClick={() => setSelectedApplicant(null)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <Image
                src="/assets/images/logo.png"
                alt="Maatram Foundation"
                width={150}
                height={60}
                priority
                className="h-11 w-auto object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* Admin User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-heading font-bold text-xs flex items-center justify-center border border-slate-700">
                A
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-bold text-slate-900 leading-tight">Admin Console</p>
                <p className="text-[10px] text-slate-500">Super Administrator</p>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block" />

            {/* Sign Out Button with Text */}
            <button
              type="button"
              onClick={() => setIsSignOutModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-heading font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200/80 rounded-xl transition cursor-pointer shadow-2xs"
              title="Sign out of admin"
            >
              <ArrowLeftOnRectangleIcon className="w-4 h-4 stroke-[2.2]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6">
        {selectedApplicant ? (
          /* ================= FULL PAGE APPLICATION DOCUMENT VIEW ================= */
          <div className="w-full space-y-6 animate-in fade-in duration-200">
            {/* Top Navigation & Action Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApplicant(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition cursor-pointer shadow-2xs"
                >
                  <ArrowLeftIcon className="w-4 h-4 text-slate-600" />
                  <span>Back to Applicants List</span>
                </button>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  {selectedApplicant.application_number || "MF-2025-001"}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                  title="Print official application form"
                >
                  <PrinterIcon className="w-4 h-4 text-slate-500" />
                  <span>Print Form</span>
                </button>

                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
                  <span className="text-slate-500 font-normal">Status:</span>
                  <select
                    value={selectedApplicant.status}
                    onChange={(e) => handleStatusChange(selectedApplicant.id, e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Official Trust Application Sheet */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-7">
              {/* Trust Letterhead Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/assets/images/logo.png"
                    alt="Maatram Foundation"
                    width={160}
                    height={80}
                    priority
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 uppercase tracking-wider">
                      Maatram Educational & Charitable Trust
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Higher Education 100% Free Scholarship Sponsorship Program (Academic Year 2025 - 2026)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Zero Donation • Zero Tuition Fee • Free Higher Education
                    </p>
                  </div>
                </div>
                <div className="sm:text-right bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <span className="block font-mono text-xs font-bold text-slate-900">
                    Application ID: {selectedApplicant.application_number || "MF-2025-001"}
                  </span>
                  <span className="inline-block mt-1">
                    {getStatusBadge(selectedApplicant.status)}
                  </span>
                </div>
              </div>

              {/* Quick Jump Navigation Strip */}
              <div className="sticky top-20 z-10 flex border border-slate-200/90 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl gap-2 overflow-x-auto text-xs font-heading font-bold text-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => document.getElementById("sec-personal")?.scrollIntoView({ behavior: "smooth" })}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-[#F7BC0F]/20 hover:text-slate-950 transition cursor-pointer whitespace-nowrap"
                >
                  1. Personal Details
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("sec-family")?.scrollIntoView({ behavior: "smooth" })}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-[#F7BC0F]/20 hover:text-slate-950 transition cursor-pointer whitespace-nowrap"
                >
                  2. Family & Income
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("sec-academic")?.scrollIntoView({ behavior: "smooth" })}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-[#F7BC0F]/20 hover:text-slate-950 transition cursor-pointer whitespace-nowrap"
                >
                  3. Academic Marks (10th/11th/12th)
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("sec-preferences")?.scrollIntoView({ behavior: "smooth" })}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-[#F7BC0F]/20 hover:text-slate-950 transition cursor-pointer whitespace-nowrap"
                >
                  4. Preferences & Career
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("sec-documents")?.scrollIntoView({ behavior: "smooth" })}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-[#F7BC0F]/20 hover:text-slate-950 transition cursor-pointer whitespace-nowrap"
                >
                  5. Documents & Verification
                </button>
              </div>

              {/* Single Scroll Sections Container */}
              <div className="space-y-8 text-xs text-slate-800">
                {/* SECTION 1: PERSONAL DETAILS */}
                <section id="sec-personal" className="scroll-mt-32 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#F7BC0F] text-slate-950 font-bold text-xs flex items-center justify-center">1</span>
                    <h4 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">
                      Personal & Contact Information
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Full Name</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.full_name || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Date of Birth</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.dob || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Gender</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.gender || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Blood Group</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.blood_group || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Aadhaar Number</span>
                      <p className="font-mono font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.aadhaar_number || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Primary Mobile</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.mobile_number || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Alternate Contact</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.alt_mobile_number || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 sm:col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Email Address</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.email || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 sm:col-span-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Permanent Address</span>
                      <p className="font-semibold text-sm text-slate-900 mt-0.5">{selectedApplicant.address || "—"}</p>
                      <p className="text-slate-600 mt-1">
                        District: <span className="font-bold text-slate-900">{selectedApplicant.district || "—"}</span> • Pincode:{" "}
                        <span className="font-mono font-bold text-slate-900">{selectedApplicant.pincode || "—"}</span>
                      </p>
                    </div>
                  </div>
                </section>

                {/* SECTION 2: FAMILY & SOCIO-ECONOMIC DETAILS */}
                <section id="sec-family" className="scroll-mt-32 space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#F7BC0F] text-slate-950 font-bold text-xs flex items-center justify-center">2</span>
                    <h4 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">
                      Family & Socio-Economic Details
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Father Name</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.father_name || "—"}</p>
                      <p className="text-slate-500 mt-1">Occupation: {selectedApplicant.father_occupation || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Mother Name</span>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedApplicant.mother_name || "—"}</p>
                      <p className="text-slate-500 mt-1">Occupation: {selectedApplicant.mother_occupation || "—"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Annual Family Income</span>
                      <p className="font-bold text-sm text-emerald-800 mt-0.5">{selectedApplicant.family_annual_income || "—"}</p>
                      <p className="text-slate-500 mt-1">Housing: {selectedApplicant.housing_status || "—"}</p>
                    </div>
                  </div>

                  {/* Special Category Badges */}
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Applicant Category & Privilege Indicators</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${selectedApplicant.first_graduate ? "bg-amber-100 border-amber-300 text-amber-950" : "bg-white border-slate-200 text-slate-500"}`}>
                        {selectedApplicant.first_graduate ? "✓ First Graduate in Family" : "Non-First Graduate"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${selectedApplicant.single_parent ? "bg-purple-100 border-purple-300 text-purple-950" : "bg-white border-slate-200 text-slate-500"}`}>
                        {selectedApplicant.single_parent ? "✓ Single Parent Child" : "Both Parents"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${selectedApplicant.orphan ? "bg-rose-100 border-rose-300 text-rose-950" : "bg-white border-slate-200 text-slate-500"}`}>
                        {selectedApplicant.orphan ? "✓ Orphan Student" : "Not Orphan"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${selectedApplicant.differently_abled ? "bg-blue-100 border-blue-300 text-blue-950" : "bg-white border-slate-200 text-slate-500"}`}>
                        {selectedApplicant.differently_abled ? "✓ Differently Abled Student" : "General Category"}
                      </span>
                    </div>
                  </div>

                  {/* Siblings Table */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Siblings Details</span>
                    {selectedApplicant.siblings && selectedApplicant.siblings.length > 0 ? (
                      <table className="w-full mt-2 text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                            <th className="py-1.5">Name</th>
                            <th className="py-1.5">Relationship</th>
                            <th className="py-1.5">Age</th>
                            <th className="py-1.5">Education</th>
                            <th className="py-1.5">Institution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60">
                          {selectedApplicant.siblings.map((s: any, i: number) => (
                            <tr key={i}>
                              <td className="py-1.5 font-bold">{s.name || "—"}</td>
                              <td className="py-1.5">{s.relationship || "—"}</td>
                              <td className="py-1.5">{s.age || "—"}</td>
                              <td className="py-1.5">{s.education || "—"}</td>
                              <td className="py-1.5">{s.institution || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-slate-400 mt-1 italic">No siblings recorded</p>
                    )}
                  </div>
                </section>

                {/* SECTION 3: ACADEMIC MARKS */}
                <section id="sec-academic" className="scroll-mt-32 space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#F7BC0F] text-slate-950 font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">
                      Academic Records (10th, 11th & 12th Marks)
                    </h4>
                  </div>

                  {/* 12th Standard Section (Most critical) */}
                  <div className="p-5 bg-amber-50/60 border border-amber-300 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading font-black text-sm text-amber-950">
                        12th Higher Secondary Marks (HSC)
                      </span>
                      {selectedApplicant.twelfth_cutoff && (
                        <span className="px-3 py-1 bg-[#F7BC0F] font-mono font-black text-sm text-slate-950 rounded-xl shadow-xs">
                          Cutoff: {selectedApplicant.twelfth_cutoff} / 200
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mt-3">
                      <div>
                        <span className="text-slate-500 block">School Name:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.twelfth_school_name || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Board / Stream:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.twelfth_board || selectedApplicant.twelfth_group || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Total Marks:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.twelfth_total_marks || "—"} / {selectedApplicant.twelfth_max_marks || "600"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Percentage:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.twelfth_percentage || "—"}%</p>
                      </div>
                    </div>
                  </div>

                  {/* 10th Standard Section */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-heading font-bold text-sm text-slate-900">10th Secondary School Marks (SSLC)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mt-3">
                      <div>
                        <span className="text-slate-500 block">School Name:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.tenth_school_name || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Passing Year:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.tenth_pass_year || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Total Marks:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.tenth_marks_obtained || "—"} / {selectedApplicant.tenth_max_marks || "500"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Percentage:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.tenth_percentage || "—"}%</p>
                      </div>
                    </div>
                  </div>

                  {/* 11th Standard Section */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-heading font-bold text-sm text-slate-900">11th Standard Marks</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mt-3">
                      <div>
                        <span className="text-slate-500 block">School:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.eleventh_school_name || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Passing Year:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.eleventh_pass_year || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Total Marks:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.eleventh_total_marks || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Percentage:</span>
                        <p className="font-bold text-slate-900">{selectedApplicant.eleventh_percentage || "—"}%</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 4: PREFERENCES & CAREER */}
                <section id="sec-preferences" className="scroll-mt-32 space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#F7BC0F] text-slate-950 font-bold text-xs flex items-center justify-center">4</span>
                    <h4 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">
                      Course Preferences & Career Goals
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Preferred Degree & Courses</span>
                      <p className="font-bold text-sm text-slate-900 mt-1">{selectedApplicant.preferred_degree || "Engineering (B.E / B.Tech)"}</p>
                      <p className="text-slate-600 mt-1">Branch Preference: {selectedApplicant.preferred_branch || "Computer Science / IT"}</p>
                      <p className="text-slate-600">Second Preference: {selectedApplicant.second_branch || "ECE / Electrical"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Location & Hostel</span>
                      <p className="font-bold text-sm text-slate-900 mt-1">Location: {selectedApplicant.preferred_location || "Chennai / Coimbatore"}</p>
                      <p className="text-slate-600 mt-1">Hostel Accommodation: {selectedApplicant.need_hostel ? "Yes, Required" : "Day Scholar"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 sm:col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Career Aspirations & Motivation</span>
                      <p className="font-medium text-slate-800 mt-1 leading-relaxed">
                        {selectedApplicant.career_aspiration || "Aiming to achieve higher education and uplift the economic status of family while contributing meaningfully to society."}
                      </p>
                    </div>
                  </div>
                </section>

                {/* SECTION 5: DOCUMENTS & VERIFICATION */}
                <section id="sec-documents" className="scroll-mt-32 space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#F7BC0F] text-slate-950 font-bold text-xs flex items-center justify-center">5</span>
                    <h4 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">
                      Documents & Verification Declaration
                    </h4>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-heading font-bold text-sm text-slate-900">Document Upload Checklist</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span>10th Marksheet Copy</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Provided</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span>11th Marksheet Copy</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Provided</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span>12th Online Result / Marksheet</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Provided</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span>Aadhaar Card Copy</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Provided</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl text-xs text-amber-950">
                    <p className="font-bold">Applicant Declaration</p>
                    <p className="mt-1 text-slate-700">
                      "I hereby declare that all details furnished in this application are true and correct to the best of my knowledge and belief. I agree to abide by the rules of Maatram Foundation."
                    </p>
                  </div>
                </section>
              </div>

              {/* Bottom Sheet Actions */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApplicant(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Back to Applicants List</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xs text-slate-700">Update Applicant Status:</span>
                  <select
                    value={selectedApplicant.status}
                    onChange={(e) => handleStatusChange(selectedApplicant.id, e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#F7BC0F] cursor-pointer shadow-xs"
                  >
                    <option value="draft">Draft (In Progress)</option>
                    <option value="submitted">Submitted (Ready for Stage 1)</option>
                    <option value="under_review">Under Review (Telephonic)</option>
                    <option value="shortlisted">Shortlisted (Home Visit)</option>
                    <option value="selected">Selected (Scholarship Awarded)</option>
                    <option value="rejected">Rejected (Not Eligible)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= REGULAR TABLE LIST VIEW ================= */
          <>
            {/* Title & Banner with Export CSV */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Applicants Details
                </h1>
                <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                  Review and manage student applications for the Maatram Foundation 2025-26 Scholarship.
                </p>
              </div>

              {/* Export CSV Button placed above search bar */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-sm border border-[#e5ad0c] w-fit"
                title="Export all applicants as CSV"
              >
                <ArrowDownTrayIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={fetchApplications}
                  className="underline font-bold text-red-700 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Status update alert toast */}
            {statusUpdateMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                <span>{statusUpdateMessage}</span>
              </div>
            )}

            {/* 2. Search, Filter & Controls Bar */}
            <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, application no, mobile, email, or district..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">

                {/* District Filter */}
                {districtList.length > 0 && (
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#F7BC0F] cursor-pointer"
                  >
                    <option value="all">All Districts</option>
                    {districtList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </section>

            {/* 3. Applicants Table */}
            <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-black text-base sm:text-lg text-slate-900">
                    Applicant Records
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing {filteredApplications.length} of {applications.length} students
                  </p>
                </div>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="py-20 text-center text-slate-500 text-xs">
                  <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-[#F7BC0F] mb-2" />
                  Loading applicants from database...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-20 text-center text-slate-500 text-xs">
                  <DocumentTextIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No applicants found</p>
                  <p className="text-slate-400 mt-1">Try adjusting your search or filter options.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-heading font-bold text-slate-600 tracking-wider uppercase text-[10px]">
                        <th className="py-3 px-4">Application No</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">District</th>
                        <th className="py-3 px-4">12th Cutoff</th>
                        <th className="py-3 px-4">Course Preference</th>
                        <th className="py-3 px-4">Family Income</th>
                        <th className="py-3 px-4 text-center">Siblings</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-amber-50/30 transition duration-150 cursor-pointer"
                          onClick={() => {
                            setSelectedApplicant(app);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          {/* Application Number */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                            {app.application_number || "MF-2025-001"}
                            <p className="text-[10px] text-slate-400 font-primary">
                              {app.created_at ? new Date(app.created_at).toLocaleDateString() : ""}
                            </p>
                          </td>

                          {/* Student Name */}
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900 font-heading text-sm">
                              {app.full_name || "Untitled Applicant"}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {app.gender || "Gender not specified"} • {app.first_graduate ? "First Graduate" : "Non-FG"}
                            </p>
                          </td>

                          {/* Contact Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold">{app.mobile_number || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5 text-[11px]">
                              <EnvelopeIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[160px]">{app.email || "—"}</span>
                            </div>
                          </td>

                          {/* District */}
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800">{app.district || "—"}</p>
                            <p className="text-[10px] text-slate-500">{app.pincode || ""}</p>
                          </td>

                          {/* 12th Cutoff */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {app.twelfth_cutoff ? (
                              <div className="inline-block px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md font-mono font-bold text-amber-900 text-xs">
                                {app.twelfth_cutoff}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                            <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                              {app.twelfth_group || ""}
                            </p>
                          </td>

                          {/* Course Preference */}
                          <td className="py-3.5 px-4">
                            {app.preferred_degree || (Array.isArray(app.preferred_courses) && app.preferred_courses.length > 0) || app.preferred_branch ? (
                              <div>
                                <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                                  <AcademicCapIcon className="w-3.5 h-3.5 text-[#F7BC0F] shrink-0" />
                                  <span>{app.preferred_degree || (Array.isArray(app.preferred_courses) ? app.preferred_courses[0] : app.preferred_branch)}</span>
                                </span>
                                {(app.preferred_branch || (Array.isArray(app.preferred_courses) && app.preferred_courses[0] && app.preferred_courses[0] !== app.preferred_degree)) && (
                                  <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                                    {app.preferred_branch || app.preferred_courses[0]}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Family Income */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {app.family_annual_income || app.annual_income ? (
                              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md font-mono font-bold text-emerald-800 text-[11px]">
                                {app.family_annual_income || app.annual_income}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Siblings Count */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {(() => {
                              const count = Array.isArray(app.siblings)
                                ? app.siblings.length
                                : typeof app.siblings_count === "number"
                                ? app.siblings_count
                                : (app.family_members_count ? parseInt(app.family_members_count, 10) : 0);
                              return count > 0 ? (
                                <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  <UserGroupIcon className="w-3 h-3 text-slate-500" />
                                  {count} {count === 1 ? "Sibling" : "Siblings"}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-mono text-xs">0</span>
                              );
                            })()}
                          </td>

                          {/* Actions */}
                          <td
                            className="py-3.5 px-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApplicant(app);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                                title="View full application"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Floating Admin AI Assistant Chatbot */}
      <AdminChatbot applicationsCount={applications.length} />

      {/* Admin Sign Out Confirmation Modal */}
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
