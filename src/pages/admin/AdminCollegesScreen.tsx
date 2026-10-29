"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAdminToken } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";
import CollegeCard, { CollegeCardData } from "../../components/CollegeCard";

export default function AdminCollegesScreen() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Add College Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeImage, setNewCollegeImage] = useState("");
  const [newCollegeBg, setNewCollegeBg] = useState("#0284C7");

  // Colleges list state (only image and name)
  const [collegesList, setCollegesList] = useState<CollegeCardData[]>([
    {
      id: "1",
      name: "PSG College of Technology",
      logoBg: "#0284C7",
      logoText: "PSG TECH",
    },
    {
      id: "2",
      name: "Vellore Institute of Technology",
      logoBg: "#0F172A",
      logoText: "VIT VELLORE",
    },
    {
      id: "3",
      name: "Thiagarajar College of Engineering",
      logoBg: "#1E40AF",
      logoText: "TCE MADURAI",
    },
    {
      id: "4",
      name: "Sri Krishna College of Engineering and Technology",
      logoBg: "#B45309",
      logoText: "SKCET",
    },
    {
      id: "5",
      name: "SASTRA Deemed University",
      logoBg: "#4F46E5",
      logoText: "SASTRA",
    },
    {
      id: "6",
      name: "Loyola-ICAM College of Engineering and Technology",
      logoBg: "#059669",
      logoText: "LICET CHENNAI",
    },
  ]);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Filter & Search
  const filteredColleges = useMemo(() => {
    return collegesList.filter((col) =>
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collegesList, searchTerm]);

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim()) return;

    const newEntry: CollegeCardData = {
      id: Date.now().toString(),
      name: newCollegeName.trim(),
      imageSrc: newCollegeImage.trim() || undefined,
      logoBg: newCollegeBg,
      logoText: newCollegeName.trim().slice(0, 4).toUpperCase(),
    };

    setCollegesList((prev) => [newEntry, ...prev]);
    setIsAddModalOpen(false);
    setNewCollegeName("");
    setNewCollegeImage("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary flex">
      {/* 1. Yellow & White Sidebar */}
      <AdminSidebar
        activeTab="colleges"
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="w-full px-6 lg:px-10 py-8 space-y-8 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Partner Colleges
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Colleges and educational institutions affiliated with Maatram Foundation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] transition cursor-pointer shadow-xs border border-[#e5ad0c]"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Add College</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search colleges by name..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white transition"
              />
            </div>
            <p className="text-xs font-semibold text-slate-500">
              Total Colleges: <span className="text-slate-900 font-bold">{filteredColleges.length}</span>
            </p>
          </div>

          {/* Colleges Card Grid (4 cards per row) */}
          {filteredColleges.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              <BuildingLibraryIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
              <p className="text-base font-bold text-slate-700">No Partner Colleges Found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No colleges match your current search query. Click "Add College" to add one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredColleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ADD COLLEGE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">Add Partner College</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCollege} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g. Loyola-ICAM College of Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={newCollegeImage}
                  onChange={(e) => setNewCollegeImage(e.target.value)}
                  placeholder="https://example.com/college-campus.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Card Theme Color
                </label>
                <div className="flex items-center gap-3">
                  {["#0284C7", "#0F172A", "#1E40AF", "#4F46E5", "#059669", "#B45309"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCollegeBg(color)}
                      className={`w-7 h-7 rounded-xl transition cursor-pointer border-2 ${
                        newCollegeBg === color ? "border-slate-900 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c]"
                >
                  Add College
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
        onConfirm={() => router.push("/")}
      />
    </div>
  );
}
