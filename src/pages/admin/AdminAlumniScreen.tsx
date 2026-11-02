"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  BriefcaseIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAdminToken, adminApi } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";

interface AlumniItem {
  id: string;
  email: string;
  full_name: string;
  roll_number: string;
  phone: string;
  whatsapp?: string;
  company: string;
  designation: string;
  experience_years: string;
  grad_batch: string;
  grad_college: string;
  grad_degree: string;
  current_city: string;
  industry_domain?: string;
  linkedin?: string;
  metadata?: any;
}

export default function AdminAlumniScreen() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [alumni, setAlumni] = useState<AlumniItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniItem | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  const fetchAlumni = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getAlumni();
      if (res && res.success && Array.isArray(res.data)) {
        setAlumni(res.data);
      } else {
        setAlumni([]);
      }
    } catch (err) {
      console.error("Error fetching alumni:", err);
      setAlumni([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const companiesList = useMemo(() => {
    const set = new Set<string>();
    alumni.forEach((a) => {
      if (a.company) set.add(a.company);
    });
    return ["All", ...Array.from(set)];
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      const matchSearch =
        !searchTerm.trim() ||
        a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.grad_college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.current_city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCompany =
        selectedCompany === "All" ||
        a.company?.toLowerCase() === selectedCompany.toLowerCase();

      return matchSearch && matchCompany;
    });
  }, [alumni, searchTerm, selectedCompany]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary flex">
      {/* 1. Yellow & White Sidebar */}
      <AdminSidebar
        activeTab="alumni"
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="w-full px-6 lg:px-10 py-8 space-y-8 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Alumni Directory
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Manage and connect with graduated scholars from Maatram Foundation working across industry leaders.
              </p>
            </div>
          </div>

          {/* Search & Company Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search alumni by name, company, designation, or city..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Alumni Table (Full width responsive layout without side-scrolling) */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-heading text-[11px] uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3.5 px-5 w-1/4">Alumni Scholar</th>
                  <th className="py-3.5 px-4 w-1/4">Role & Organization</th>
                  <th className="py-3.5 px-4 w-1/4">College & Graduation</th>
                  <th className="py-3.5 px-4 w-1/6">Location & Email</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <ArrowPathIcon className="w-6 h-6 mx-auto mb-2 text-emerald-500 animate-spin" />
                      <p className="text-xs text-slate-500">Loading alumni directory...</p>
                    </td>
                  </tr>
                ) : filteredAlumni.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <AcademicCapIcon className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                      <p className="text-sm font-semibold text-slate-600">No Alumni Records Found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        No alumni matched your current filter criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAlumni.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition">
                      {/* Alumni Name & Roll */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                            {a.full_name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{a.full_name}</p>
                            <span className="font-mono text-[10px] text-slate-500">{a.roll_number}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Organization */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <BuildingOffice2Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{a.company}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{a.designation} • {a.experience_years}</p>
                      </td>

                      {/* College & Degree */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{a.grad_college}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mr-1.5">
                            {a.grad_batch}
                          </span>
                          {a.grad_degree}
                        </p>
                      </td>

                      {/* Location & Email */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <MapPinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {a.current_city}
                        </span>
                        <a
                          href={`mailto:${a.email}`}
                          className="text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-mono text-[11px] mt-0.5"
                        >
                          <EnvelopeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{a.email}</span>
                        </a>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAlumni(a)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 transition"
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Alumni Details Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {selectedAlumni.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">{selectedAlumni.full_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedAlumni.roll_number}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlumni(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Current Career & Organization</p>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <BuildingOffice2Icon className="w-4 h-4 text-emerald-600" />
                  {selectedAlumni.company}
                </p>
                <p className="text-slate-700 font-semibold">{selectedAlumni.designation} • {selectedAlumni.experience_years}</p>
                <p className="text-slate-500">{selectedAlumni.industry_domain}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Graduation & College</p>
                <p className="font-semibold text-slate-800">{selectedAlumni.grad_college}</p>
                <p className="text-slate-600">{selectedAlumni.grad_degree} ({selectedAlumni.grad_batch})</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1.5">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Contact & Social</p>
                <p className="text-slate-800 flex items-center gap-2 font-mono"><EnvelopeIcon className="w-3.5 h-3.5 text-slate-400" />{selectedAlumni.email}</p>
                <p className="text-slate-800 flex items-center gap-2"><PhoneIcon className="w-3.5 h-3.5 text-slate-400" />{selectedAlumni.phone || selectedAlumni.whatsapp}</p>
                <p className="text-slate-600 flex items-center gap-2"><MapPinIcon className="w-3.5 h-3.5 text-slate-400" />{selectedAlumni.current_city}</p>
                {selectedAlumni.linkedin && (
                  <p className="text-blue-600 font-mono text-[11px] pt-1">
                    🔗 {selectedAlumni.linkedin}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAlumni(null)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => router.push("/")}
      />
    </div>
  );
}
