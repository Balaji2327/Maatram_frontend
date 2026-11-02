"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAdminToken, adminApi } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";

interface StudentItem {
  id: string;
  email: string;
  full_name: string;
  roll_number: string;
  phone: string;
  dob?: string;
  gender?: string;
  blood_group?: string;
  district?: string;
  college?: string;
  degree?: string;
  year?: string;
  cgpa?: string;
  status?: string;
  current_stage?: string;
  metadata?: any;
}

export default function AdminStudentsScreen() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getStudents();
      if (res && res.success && Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const q = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.roll_number?.toLowerCase().includes(q) ||
        s.college?.toLowerCase().includes(q) ||
        s.degree?.toLowerCase().includes(q) ||
        s.district?.toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

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
                Students Directory
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Directory of currently supported scholarship students registered with authentication credentials.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students by name, reg no, college or branch..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Student Table (Full width responsive layout without side-scrolling) */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-heading text-[11px] uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3.5 px-5 w-1/4">Scholar Student</th>
                  <th className="py-3.5 px-4 w-1/3">College & Degree</th>
                  <th className="py-3.5 px-4 w-1/6">Year & CGPA</th>
                  <th className="py-3.5 px-4 w-1/5">District & Email</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <ArrowPathIcon className="w-6 h-6 mx-auto mb-2 text-amber-500 animate-spin" />
                      <p className="text-xs text-slate-500">Loading student directory...</p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <UserGroupIcon className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                      <p className="text-sm font-semibold text-slate-600">No Students Found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        No students matched your search criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-amber-50/30 transition">
                      {/* Student Name & Roll */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0">
                            {s.full_name?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{s.full_name}</p>
                            <span className="font-mono text-[10px] text-slate-500">{s.roll_number}</span>
                          </div>
                        </div>
                      </td>

                      {/* College & Degree */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{s.college}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{s.degree}</p>
                      </td>

                      {/* Year & CGPA */}
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 font-medium">{s.year}</p>
                        <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5">
                          CGPA: {s.cgpa}
                        </span>
                      </td>

                      {/* District & Email */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <MapPinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {s.district}
                        </span>
                        <a
                          href={`mailto:${s.email}`}
                          className="text-slate-500 hover:text-amber-600 flex items-center gap-1 font-mono text-[11px] mt-0.5"
                        >
                          <EnvelopeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{s.email}</span>
                        </a>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(s)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 transition"
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

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                  {selectedStudent.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">{selectedStudent.full_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedStudent.roll_number}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                <p className="text-[10px] uppercase font-semibold text-slate-400">College & Degree</p>
                <p className="font-bold text-slate-800">{selectedStudent.college}</p>
                <p className="text-slate-600">{selectedStudent.degree}</p>
                <p className="text-amber-700 font-semibold">{selectedStudent.year} • CGPA: {selectedStudent.cgpa}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Contact & Location</p>
                <p className="text-slate-800 flex items-center gap-1.5 font-mono"><EnvelopeIcon className="w-3.5 h-3.5 text-slate-400" />{selectedStudent.email}</p>
                <p className="text-slate-800 flex items-center gap-1.5"><PhoneIcon className="w-3.5 h-3.5 text-slate-400" />{selectedStudent.phone || selectedStudent.metadata?.phone}</p>
                <p className="text-slate-600 flex items-center gap-1.5"><MapPinIcon className="w-3.5 h-3.5 text-slate-400" />{selectedStudent.district}, {selectedStudent.metadata?.state || "Tamil Nadu"}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Family & Financials</p>
                <p className="text-slate-700"><span className="font-semibold">Father:</span> {selectedStudent.metadata?.father_name} ({selectedStudent.metadata?.father_occupation})</p>
                <p className="text-slate-700"><span className="font-semibold">Mother:</span> {selectedStudent.metadata?.mother_name} ({selectedStudent.metadata?.mother_occupation})</p>
                <p className="text-slate-700"><span className="font-semibold">Annual Income:</span> {selectedStudent.metadata?.family_annual_income}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Academics (Schooling)</p>
                <p className="text-slate-700"><span className="font-semibold">12th Cutoff:</span> {selectedStudent.metadata?.twelfth_cutoff}</p>
                <p className="text-slate-700"><span className="font-semibold">12th Marks:</span> {selectedStudent.metadata?.twelfth_marks} ({selectedStudent.metadata?.twelfth_percentage})</p>
                <p className="text-slate-700"><span className="font-semibold">10th Marks:</span> {selectedStudent.metadata?.tenth_marks} ({selectedStudent.metadata?.tenth_percentage})</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-1.5">
              <p className="font-bold text-amber-900">Career Ambition & Goals</p>
              <p className="text-slate-700 italic">"{selectedStudent.metadata?.career_ambition}"</p>
              <p className="text-[11px] text-slate-600 mt-1">{selectedStudent.metadata?.future_goals}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
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
