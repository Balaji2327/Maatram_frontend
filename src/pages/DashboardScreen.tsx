"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SignOutModal from "../components/SignOutModal";
import { applicationApi, authApi, getAuthToken } from "../lib/api";
import {
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  HomeModernIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowLeftOnRectangleIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  PhoneIcon,
  InformationCircleIcon,
  BuildingLibraryIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  EyeIcon,
  PrinterIcon,
  PencilSquareIcon,
  XMarkIcon,
  VideoCameraIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function DashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"personal" | "family" | "academic" | "preferences" | "documents">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Authentication Guard: Ensure user has signed in with credentials
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/?loginRequired=true");
    }
  }, [router]);

  // Initial state empty with placeholders
  const [formData, setFormData] = useState({
    applicationNumber: "",
    // Personal Details
    fullName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    aadhaarNumber: "",
    mobileNumber: "",
    altMobileNumber: "",
    email: "",
    address: "",
    district: "",
    pincode: "",

    // Family Details
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    annualIncome: "",
    familyMembersCount: "",
    firstGraduate: "",
    singleParent: "",
    community: "",

    // Academic Details
    tenthSchool: "",
    tenthSchoolAddress: "",
    tenthBoard: "",
    tenthYear: "",
    tenthTotalMarks: "",
    tenthPercentage: "",

    // 11th Standard Details
    eleventhSchool: "",
    eleventhSchoolAddress: "",
    eleventhBoard: "",
    eleventhStream: "",
    eleventhYear: "",
    eleventhTotalMarks: "",
    eleventhPercentage: "",

    // 12th Standard Details
    twelfthSchool: "",
    twelfthSchoolAddress: "",
    twelfthStream: "",
    twelfthYear: "",
    twelfthTotalMarks: "",
    twelfthCutoff: "",
    mediumOfInstruction: "",

    // Preferences
    preferredDegree: "",
    preferredBranch: "",
    secondBranch: "",
    preferredLocation: "",
    hostelRequired: "",
    careerGoal: "",

    // Declaration
    declarationAgreed: false,
  });

  // Siblings list state
  const [siblings, setSiblings] = useState<Array<{
    id: string;
    name: string;
    relationship: string;
    age: string;
    education: string;
    institution: string;
  }>>([]);

  const handleAddSibling = () => {
    setSiblings((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        relationship: "",
        age: "",
        education: "",
        institution: "",
      },
    ]);
  };

  const handleRemoveSibling = (id: string) => {
    setSiblings((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSiblingChange = (id: string, field: string, value: string) => {
    setSiblings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // 11th Standard Subject-wise Marks State
  const [eleventhSubjects, setEleventhSubjects] = useState<Array<{
    id: string;
    subjectName: string;
    maxMarks: string;
    marksObtained: string;
  }>>([
    { id: "11-1", subjectName: "Language (Tamil / Hindi / Other)", maxMarks: "100", marksObtained: "" },
    { id: "11-2", subjectName: "English", maxMarks: "100", marksObtained: "" },
    { id: "11-3", subjectName: "", maxMarks: "100", marksObtained: "" },
    { id: "11-4", subjectName: "", maxMarks: "100", marksObtained: "" },
    { id: "11-5", subjectName: "", maxMarks: "100", marksObtained: "" },
    { id: "11-6", subjectName: "", maxMarks: "100", marksObtained: "" },
  ]);

  const handleAdd11thSubject = () => {
    setEleventhSubjects((prev) => [
      ...prev,
      { id: Date.now().toString(), subjectName: "", maxMarks: "100", marksObtained: "" },
    ]);
  };

  const handleRemove11thSubject = (id: string) => {
    setEleventhSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handle11thSubjectChange = (id: string, field: "subjectName" | "maxMarks" | "marksObtained", value: string) => {
    setEleventhSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calc11thTotal = () => {
    const total = eleventhSubjects.reduce((acc, curr) => acc + (parseFloat(curr.marksObtained) || 0), 0);
    const max = eleventhSubjects.reduce((acc, curr) => acc + (parseFloat(curr.maxMarks) || 0), 0);
    return { total, max };
  };

  // 12th Standard Subject-wise Marks State
  const [twelfthSubjects, setTwelfthSubjects] = useState<Array<{
    id: string;
    subjectName: string;
    maxMarks: string;
    marksObtained: string;
  }>>([
    { id: "12-1", subjectName: "Language (Tamil / Hindi / Other)", maxMarks: "100", marksObtained: "" },
    { id: "12-2", subjectName: "English", maxMarks: "100", marksObtained: "" },
    { id: "12-3", subjectName: "", maxMarks: "100", marksObtained: "" },
    { id: "12-4", subjectName: "", maxMarks: "100", marksObtained: "" },
    { id: "12-5", subjectName: "", maxMarks: "100", marksObtained: "" },
    { id: "12-6", subjectName: "", maxMarks: "100", marksObtained: "" },
  ]);

  const handleAdd12thSubject = () => {
    setTwelfthSubjects((prev) => [
      ...prev,
      { id: Date.now().toString(), subjectName: "", maxMarks: "100", marksObtained: "" },
    ]);
  };

  const handleRemove12thSubject = (id: string) => {
    setTwelfthSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handle12thSubjectChange = (id: string, field: "subjectName" | "maxMarks" | "marksObtained", value: string) => {
    setTwelfthSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calc12thTotal = () => {
    const total = twelfthSubjects.reduce((acc, curr) => acc + (parseFloat(curr.marksObtained) || 0), 0);
    const max = twelfthSubjects.reduce((acc, curr) => acc + (parseFloat(curr.maxMarks) || 0), 0);
    return { total, max };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Load previously saved application from Supabase database on mount
  useEffect(() => {
    async function loadSavedApplication() {
      try {
        const res = await applicationApi.getMyApplication();
        if (res.success && res.data) {
          const d = res.data;
          setFormData((prev) => ({
            ...prev,
            ...d,
          }));
          if (d.siblings && d.siblings.length > 0) setSiblings(d.siblings);
          if (d.eleventhSubjects && d.eleventhSubjects.length > 0) setEleventhSubjects(d.eleventhSubjects);
          if (d.twelfthSubjects && d.twelfthSubjects.length > 0) setTwelfthSubjects(d.twelfthSubjects);
          if (d.status === "submitted") setIsSubmitted(true);
        }
      } catch (err) {
        console.warn("Load application error:", err);
      }
    }
    loadSavedApplication();
  }, []);

  const handleSaveDraft = async () => {
    setIsSaved(true);
    try {
      await applicationApi.saveDraft({
        ...formData,
        siblings,
        eleventhSubjects,
        twelfthSubjects,
      });
    } catch (err) {
      console.warn("Save draft error:", err);
    }
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReviewOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await applicationApi.submitApplication({
        ...formData,
        siblings,
        eleventhSubjects,
        twelfthSubjects,
      });
      if (res.data?.applicationNumber) {
        setFormData((prev: any) => ({ ...prev, applicationNumber: res.data.applicationNumber }));
      }
    } catch (err) {
      console.warn("Submit error:", err);
    } finally {
      setIsSubmitting(false);
      setIsReviewOpen(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] font-primary selection:bg-[#F7BC0F] selection:text-black">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo + Portal Tag */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link href="/dashboard" className="flex items-center focus:outline-none">
              <Image
                src="/assets/images/logo.png"
                alt="Maatram Foundation"
                width={170}
                height={80}
                priority
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>

            {/* Vertical Divider */}
            <div className="hidden md:block h-7 w-px bg-slate-200" />

            {/* Portal Title & Batch Tag */}
            <div className="hidden md:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xs text-slate-900 tracking-tight">
                  Student Application Portal
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100/80 text-[10px] font-bold text-amber-900 border border-amber-300/60">
                  2025–26
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-primary">
                Transforming Lives Through Free Higher Education
              </span>
            </div>
          </div>

          {/* Right: Student Profile Pill + Sign Out */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Student Profile Capsule */}
            <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 pl-1.5 pr-3 py-1.5 rounded-2xl transition">
              {/* Initials Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F7BC0F] to-amber-300 text-slate-950 font-heading font-black text-xs flex items-center justify-center shadow-2xs">
                {formData.fullName
                  ? formData.fullName.trim().charAt(0).toUpperCase()
                  : "S"}
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] sm:max-w-[160px] truncate">
                    {formData.fullName || "Student Applicant"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Session" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formData.applicationNumber || "MF-2025-001"}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={() => setShowSignOutModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50/80 transition cursor-pointer shadow-2xs"
              title="Sign Out of Portal"
            >
              <ArrowLeftOnRectangleIcon className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
        
        {/* Banner Notification if Submitted */}
        {isSubmitted ? (
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 text-center shadow-xl max-w-2xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircleIcon className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-5">
              Application Submitted Successfully!
            </h2>
            <p className="font-primary text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your scholarship application has been received under Application ID:{" "}
              <strong className="text-slate-900 font-mono">{formData.applicationNumber || "MF-2025-001"}</strong>.
              Our verification team will review your academic and socio-economic details.
            </p>

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold text-slate-900">{formData.fullName || "Student Applicant"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Degree:</span>
                <span className="font-semibold text-slate-900">{formData.preferredDegree || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Under Verification
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <Link
                href="/process"
                className="w-full sm:w-auto px-8 py-3 bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-sm rounded-xl transition shadow-lg shadow-[#F7BC0F]/30 hover:shadow-xl border border-[#e5ad0c] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to Home</span>
                <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        ) : isReviewOpen ? (
          /* ================= FULL PAGE APPLICATION DOCUMENT VIEW ================= */
          <div className="w-full space-y-6">

            {/* Official Application Document Sheet */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-7">
              
              {/* Trust Letterhead Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/assets/images/logo.png"
                    alt="Maatram Foundation"
                    width={160}
                    height={80}
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
                    Application ID: {formData.applicationNumber || "MF-2025-001"}
                  </span>
                  <span className="inline-block mt-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    Ready for Final Submission
                  </span>
                </div>
              </div>

              {/* Section 1: Personal Details */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#F7BC0F]" />
                    1. Personal & Contact Information
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("personal");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Section
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Full Name</span>
                    <strong className="text-slate-900 text-sm">{formData.fullName || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Date of Birth</span>
                    <strong className="text-slate-900">{formData.dob || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Gender</span>
                    <strong className="text-slate-900">{formData.gender || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Blood Group</span>
                    <strong className="text-slate-900">{formData.bloodGroup || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Aadhaar Number</span>
                    <strong className="text-slate-900 font-mono">{formData.aadhaarNumber || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Mobile Number</span>
                    <strong className="text-slate-900 font-mono">{formData.mobileNumber || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Alt. Contact</span>
                    <strong className="text-slate-900 font-mono">{formData.altMobileNumber || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Email Address</span>
                    <strong className="text-slate-900">{formData.email || "-"}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Residential Address</span>
                    <strong className="text-slate-900">{formData.address || "-"}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">District & Pincode</span>
                    <strong className="text-slate-900">
                      {formData.district ? `${formData.district} - ${formData.pincode}` : "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Family & Socio-Economic Details */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <HomeModernIcon className="w-4 h-4 text-[#F7BC0F]" />
                    2. Family & Socio-Economic Background
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("family");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Section
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Father / Guardian</span>
                    <strong className="text-slate-900">{formData.fatherName || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Father's Occupation</span>
                    <strong className="text-slate-900">{formData.fatherOccupation || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Mother's Name</span>
                    <strong className="text-slate-900">{formData.motherName || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Mother's Occupation</span>
                    <strong className="text-slate-900">{formData.motherOccupation || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Annual Family Income</span>
                    <strong className="text-slate-900 font-semibold">{formData.annualIncome || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Family Members Count</span>
                    <strong className="text-slate-900">{formData.familyMembersCount || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">First Generation Graduate</span>
                    <strong className="text-slate-900">{formData.firstGraduate || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Single Parent / Orphan</span>
                    <strong className="text-slate-900">{formData.singleParent || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Community / Category</span>
                    <strong className="text-slate-900">{formData.community || "-"}</strong>
                  </div>
                </div>

                {/* Sibling rows in full document review */}
                {siblings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <span className="text-[11px] text-slate-600 block uppercase font-bold mb-2">
                      Siblings Details ({siblings.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {siblings.map((sib, i) => (
                        <div key={sib.id || i} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                          <strong className="text-slate-900 block font-heading">{sib.name || `Sibling ${i + 1}`}</strong>
                          <div className="text-slate-600 mt-1">
                            {sib.relationship || "Sibling"} • Age: {sib.age || "-"}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {sib.education || "Studying / Working"} {sib.institution ? `@ ${sib.institution}` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Academic Qualifications (10th, 11th, 12th) */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4 text-[#F7BC0F]" />
                    3. Academic Background (10th, 11th, 12th Standard)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("academic");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Section
                  </button>
                </div>

                {/* 10th Standard Summary */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
                    <span>10th Standard (SSLC)</span>
                    <span className="text-emerald-700 font-bold">
                      {formData.tenthTotalMarks || "-"} Marks ({formData.tenthPercentage || "-"}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">School Name</span>
                      <strong className="text-slate-900">{formData.tenthSchool || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">School Address</span>
                      <strong className="text-slate-900">{formData.tenthSchoolAddress || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Board of Study</span>
                      <strong className="text-slate-900">{formData.tenthBoard || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Passing Year</span>
                      <strong className="text-slate-900">{formData.tenthYear || "-"}</strong>
                    </div>
                  </div>
                </div>

                {/* 11th Standard Summary & Mark Table */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    <span>11th Standard (HSC Plus One)</span>
                    <span className="text-amber-800 font-mono text-xs">
                      Total: {calc11thTotal().total} / {calc11thTotal().max}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">School Name</span>
                      <strong className="text-slate-900">{formData.eleventhSchool || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">School Address</span>
                      <strong className="text-slate-900">{formData.eleventhSchoolAddress || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Stream & Year</span>
                      <strong className="text-slate-900">{formData.eleventhStream || "-"} ({formData.eleventhYear || "-"})</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Aggregate Marks</span>
                      <strong className="text-emerald-700">
                        {formData.eleventhTotalMarks || "-"} ({formData.eleventhPercentage || "-"}%)
                      </strong>
                    </div>
                  </div>

                  {/* 11th Subject Marks Table */}
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                        <tr>
                          <th className="py-2 px-3">Subject Name</th>
                          <th className="py-2 px-3 text-center w-28">Max Marks</th>
                          <th className="py-2 px-3 text-center w-36">Marks Obtained</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {eleventhSubjects.map((sub, i) => (
                          <tr key={sub.id || i} className="hover:bg-slate-50">
                            <td className="py-2 px-3 text-slate-900 font-medium">{sub.subjectName || `Subject ${i + 1}`}</td>
                            <td className="py-2 px-3 text-center text-slate-500">{sub.maxMarks}</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-900">{sub.marksObtained || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 12th Standard Summary & Mark Table */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    <span>12th Standard (HSC Plus Two)</span>
                    <span className="text-emerald-700 font-mono text-xs font-black">
                      Total: {calc12thTotal().total} / {calc12thTotal().max} | Cutoff: {formData.twelfthCutoff || "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">School Name</span>
                      <strong className="text-slate-900">{formData.twelfthSchool || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">School Address</span>
                      <strong className="text-slate-900">{formData.twelfthSchoolAddress || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Stream & Medium</span>
                      <strong className="text-slate-900">{formData.twelfthStream || "-"} ({formData.mediumOfInstruction || "-"})</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Year of Passing</span>
                      <strong className="text-slate-900">{formData.twelfthYear || "-"}</strong>
                    </div>
                  </div>

                  {/* 12th Subject Marks Table */}
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                        <tr>
                          <th className="py-2 px-3">Subject Name</th>
                          <th className="py-2 px-3 text-center w-28">Max Marks</th>
                          <th className="py-2 px-3 text-center w-36">Marks Obtained</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {twelfthSubjects.map((sub, i) => (
                          <tr key={sub.id || i} className="hover:bg-slate-50">
                            <td className="py-2 px-3 text-slate-900 font-medium">{sub.subjectName || `Subject ${i + 1}`}</td>
                            <td className="py-2 px-3 text-center text-slate-500">{sub.maxMarks}</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-900">{sub.marksObtained || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Section 4: Course Preferences */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <BuildingLibraryIcon className="w-4 h-4 text-[#F7BC0F]" />
                    4. Higher Education Course & College Preferences
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("preferences");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Section
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Target Degree</span>
                    <strong className="text-slate-900 text-sm">{formData.preferredDegree || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">1st Choice Course</span>
                    <strong className="text-slate-900">{formData.preferredBranch || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">2nd Choice Course</span>
                    <strong className="text-slate-900">{formData.secondBranch || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Preferred Location</span>
                    <strong className="text-slate-900">{formData.preferredLocation || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Hostel Accommodation</span>
                    <strong className="text-slate-900">{formData.hostelRequired || "-"}</strong>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Dream Career Ambition</span>
                    <p className="text-slate-800 italic mt-0.5">{formData.careerGoal || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Section 5: Documents Attached Checklist */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-[#F7BC0F]" />
                    5. Mandatory Supporting Documents Checklist
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("documents");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Documents
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-900">10th Standard Marksheet (SSLC)</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-900">11th Standard Marksheet (Plus One)</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-900">12th Standard Marksheet (HSC)</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-900">Student Aadhaar Card (Front & Back Copy)</span>
                  </div>
                </div>
              </div>

              {/* Student Self Declaration Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 leading-relaxed">
                <strong>Legal & Truthfulness Declaration:</strong> I hereby declare that all details entered in this application form are accurate and complete to the best of my knowledge. I understand that Maatram Foundation provides 100% cost-free scholarship sponsorships and does not collect any donation or fee.
              </div>

              {/* Final Bottom Submission Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsReviewOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  ← Return to Form & Edit
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#F7BC0F] hover:bg-[#e5ad0c] text-slate-950 font-heading font-black text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-[#F7BC0F]/30 hover:shadow-xl transition-all cursor-pointer border border-[#e5ad0c]"
                  >
                    <span>{isSubmitting ? "Submitting Application..." : "Yes, Submit Application"}</span>
                    <ArrowRightIcon className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="w-full space-y-6">
              
              {/* Portal Welcome & Overview */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      Application Form
                    </h1>
                    <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                      Fill out all sections below to apply for 100% cost-free higher education sponsorship.
                    </p>
                  </div>
                </div>

                {/* Navigation Section Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mt-6 overflow-x-auto scrollbar-none">
                  {[
                    { id: "personal", label: "1. Personal", icon: UserIcon },
                    { id: "family", label: "2. Family", icon: HomeModernIcon },
                    { id: "academic", label: "3. Academic", icon: AcademicCapIcon },
                    { id: "preferences", label: "4. Preferences", icon: BuildingLibraryIcon },
                    { id: "documents", label: "5. Documents", icon: DocumentTextIcon },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id as typeof activeTab);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                          isActive
                            ? "bg-white text-slate-900 border border-slate-200 shadow-sm font-bold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#F7BC0F]" : "text-slate-400"}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Body Card */}
              <form onSubmit={handleOpenReview} autoComplete="off" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* ================= TAB 1: PERSONAL DETAILS ================= */}
                {activeTab === "personal" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Section 1: Personal & Communication Details
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please provide accurate identity and contact information.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Full Name (as in 10th / 12th certificate)
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter your full name"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender / Non-binary</option>
                        </select>
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Blood Group
                        </label>
                        <input
                          type="text"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter blood group (e.g., O+, A+, B+)"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Aadhaar Number */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Aadhaar Number
                        </label>
                        <input
                          type="text"
                          name="aadhaarNumber"
                          value={formData.aadhaarNumber}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter 12-digit Aadhaar number"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Primary Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter 10-digit mobile number"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Alternate Contact */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Alternate / Parent Contact Number
                        </label>
                        <input
                          type="tel"
                          name="altMobileNumber"
                          value={formData.altMobileNumber}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter alternate contact number"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter your email address"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Permanent Residential Address
                        </label>
                        <textarea
                          name="address"
                          rows={2}
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter door no., street name, village / town"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* District */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Home District
                        </label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter your home district"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter 6-digit pincode"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 2: FAMILY & SOCIO-ECONOMIC ================= */}
                {activeTab === "family" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Section 2: Family & Socio-Economic Status
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Maatram Foundation prioritizes students from low-income and vulnerable backgrounds.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Father Name & Occupation */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Father / Guardian Name
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter father or guardian's full name"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Father's Occupation
                        </label>
                        <input
                          type="text"
                          name="fatherOccupation"
                          value={formData.fatherOccupation}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter father's occupation"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Mother Name & Occupation */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Mother's Name
                        </label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter mother's full name"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Mother's Occupation
                        </label>
                        <input
                          type="text"
                          name="motherOccupation"
                          value={formData.motherOccupation}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter mother's occupation"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Annual Family Income */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Annual Family Income
                        </label>
                        <select
                          name="annualIncome"
                          value={formData.annualIncome}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Annual Income Range</option>
                          <option value="Below ₹60,000">Below ₹60,000</option>
                          <option value="₹60,000 - ₹1,00,000">₹60,000 - ₹1,00,000</option>
                          <option value="₹1,00,000 - ₹1,50,000">₹1,00,000 - ₹1,50,000</option>
                          <option value="Above ₹1,50,000">Above ₹1,50,000</option>
                        </select>
                      </div>

                      {/* Community / Category */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Community / Category
                        </label>
                        <select
                          name="community"
                          value={formData.community}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Community / Category</option>
                          <option value="BC">BC (Backward Class)</option>
                          <option value="MBC">MBC (Most Backward Class)</option>
                          <option value="SC">SC / SCA (Scheduled Caste)</option>
                          <option value="ST">ST (Scheduled Tribe)</option>
                          <option value="OC">OC (Open Competition)</option>
                        </select>
                      </div>

                      {/* First Generation Graduate */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          First Generation Graduate in Family?
                        </label>
                        <select
                          name="firstGraduate"
                          value={formData.firstGraduate}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Option</option>
                          <option value="Yes">Yes (First in family to attend college)</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {/* Single Parent or Orphan */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Single Parent / Orphan / Ward of Destitute?
                        </label>
                        <select
                          name="singleParent"
                          value={formData.singleParent}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Option</option>
                          <option value="No">No</option>
                          <option value="Single Mother">Yes - Single Parent (Mother)</option>
                          <option value="Single Father">Yes - Single Parent (Father)</option>
                          <option value="Orphan">Yes - Orphan / Supported by Relatives</option>
                        </select>
                      </div>
                    </div>

                    {/* ================= SIBLINGS DETAILS SECTION ================= */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="w-5 h-5 text-[#F7BC0F]" />
                            <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                              Siblings Details (Brothers & Sisters)
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 font-primary">
                            Add details of your siblings, their education level, and current occupation.
                          </p>
                        </div>

                        {/* Add Sibling Button on Side */}
                        <button
                          type="button"
                          onClick={handleAddSibling}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-[#F7BC0F]/20 text-slate-900 border border-[#F7BC0F] font-heading font-bold text-xs rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer"
                        >
                          <PlusIcon className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                          <span>Add Sibling</span>
                        </button>
                      </div>

                      {siblings.length === 0 ? (
                        <div className="bg-slate-50/70 border border-dashed border-slate-300 rounded-2xl p-6 text-center">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                            <UserGroupIcon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-slate-700 mt-2">No siblings added</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            If you have brothers or sisters, click the "Add Sibling" button on the side to record their education details.
                          </p>
                          <button
                            type="button"
                            onClick={handleAddSibling}
                            className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-heading font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>+ Add Sibling</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {siblings.map((sibling, index) => (
                            <div
                              key={sibling.id}
                              className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 relative transition"
                            >
                              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70">
                                <span className="font-heading font-bold text-xs text-slate-800 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-[#F7BC0F] text-slate-950 flex items-center justify-center text-[10px] font-black">
                                    {index + 1}
                                  </span>
                                  Sibling #{index + 1}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveSibling(sibling.id)}
                                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition cursor-pointer"
                                  title="Remove this sibling"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                {/* Sibling Name */}
                                <div>
                                  <label className="block text-xs font-heading font-bold text-slate-800">
                                    Sibling's Name
                                  </label>
                                  <input
                                    type="text"
                                    value={sibling.name}
                                    onChange={(e) => handleSiblingChange(sibling.id, "name", e.target.value)}
                                    autoComplete="off"
                                    placeholder="Enter sibling's name"
                                    className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                                  />
                                </div>

                                {/* Relationship */}
                                <div>
                                  <label className="block text-xs font-heading font-bold text-slate-800">
                                    Relationship
                                  </label>
                                  <select
                                    value={sibling.relationship}
                                    onChange={(e) => handleSiblingChange(sibling.id, "relationship", e.target.value)}
                                    className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                                  >
                                    <option value="">Select Relationship</option>
                                    <option value="Elder Brother">Elder Brother</option>
                                    <option value="Younger Brother">Younger Brother</option>
                                    <option value="Elder Sister">Elder Sister</option>
                                    <option value="Younger Sister">Younger Sister</option>
                                  </select>
                                </div>

                                {/* Age */}
                                <div>
                                  <label className="block text-xs font-heading font-bold text-slate-800">
                                    Age
                                  </label>
                                  <input
                                    type="text"
                                    value={sibling.age}
                                    onChange={(e) => handleSiblingChange(sibling.id, "age", e.target.value)}
                                    autoComplete="off"
                                    placeholder="e.g., 18"
                                    className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                                  />
                                </div>

                                {/* Current Study / Class / Occupation */}
                                <div>
                                  <label className="block text-xs font-heading font-bold text-slate-800">
                                    Current Study / Qualification / Occupation
                                  </label>
                                  <input
                                    type="text"
                                    value={sibling.education}
                                    onChange={(e) => handleSiblingChange(sibling.id, "education", e.target.value)}
                                    autoComplete="off"
                                    placeholder="e.g., 10th Std / B.Com / Employed"
                                    className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                                  />
                                </div>

                                {/* School / College / Workplace Name */}
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-heading font-bold text-slate-800">
                                    School / College / Workplace Name
                                  </label>
                                  <input
                                    type="text"
                                    value={sibling.institution}
                                    onChange={(e) => handleSiblingChange(sibling.id, "institution", e.target.value)}
                                    autoComplete="off"
                                    placeholder="Enter school, college, or company name"
                                    className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= TAB 3: ACADEMIC DETAILS ================= */}
                {activeTab === "academic" && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Section 3: Academic Qualifications
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please enter marks scored in 10th Standard, 11th Standard, and 12th Standard.
                      </p>
                    </div>

                    {/* 10th Standard Box */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F7BC0F]/20 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider">
                        10th Standard (SSLC)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th School Name
                          </label>
                          <input
                            type="text"
                            name="tenthSchool"
                            value={formData.tenthSchool}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter 10th standard school name"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th School Address & Location
                          </label>
                          <input
                            type="text"
                            name="tenthSchoolAddress"
                            value={formData.tenthSchoolAddress}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter 10th school address, town/village & district"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Board of Study
                          </label>
                          <input
                            type="text"
                            name="tenthBoard"
                            value={formData.tenthBoard}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter board of study (State Board / CBSE / ICSE)"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th Total Marks & Percentage
                          </label>
                          <input
                            type="text"
                            name="tenthTotalMarks"
                            value={formData.tenthTotalMarks}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter 10th total marks & percentage"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ================= 11th Standard Box ================= */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F7BC0F]/20 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider">
                          11th Standard (HSC Plus One)
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          School Details & Subject-wise Mark Entry
                        </span>
                      </div>

                      {/* 11th School Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            11th School Name
                          </label>
                          <input
                            type="text"
                            name="eleventhSchool"
                            value={formData.eleventhSchool}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter 11th standard school name"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            11th School Address & Location
                          </label>
                          <input
                            type="text"
                            name="eleventhSchoolAddress"
                            value={formData.eleventhSchoolAddress}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter 11th school address, town/village & district"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Subject Group / Stream
                          </label>
                          <input
                            type="text"
                            name="eleventhStream"
                            value={formData.eleventhStream}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="e.g., Bio-Maths / Computer Science / Commerce"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Board of Study
                          </label>
                          <input
                            type="text"
                            name="eleventhBoard"
                            value={formData.eleventhBoard}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="e.g., Tamil Nadu State Board / CBSE / ICSE"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>
                      </div>

                      {/* 11th Subject-wise Mark Entry Table */}
                      <div className="pt-3 border-t border-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div>
                            <h5 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                              11th Standard Subject-wise Mark Entry
                            </h5>
                            <p className="text-[11px] text-slate-500 font-primary">
                              Enter marks obtained in each 11th standard subject out of maximum marks.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {calc11thTotal().total > 0 && (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                                Total: {calc11thTotal().total} / {calc11thTotal().max} ({((calc11thTotal().total / (calc11thTotal().max || 1)) * 100).toFixed(1)}%)
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={handleAdd11thSubject}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-heading font-bold text-xs rounded-lg transition cursor-pointer"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                              <span>+ Add Subject</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[11px] font-heading font-bold text-slate-600 px-3 pb-1">
                            <span className="col-span-1 text-center">#</span>
                            <span className="col-span-6">Subject Name</span>
                            <span className="col-span-2 text-center">Max Marks</span>
                            <span className="col-span-2 text-center">Marks Obtained</span>
                            <span className="col-span-1 text-center">Action</span>
                          </div>

                          {eleventhSubjects.map((sub, idx) => (
                            <div
                              key={sub.id}
                              className="bg-white border border-slate-200 rounded-xl p-3 sm:p-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center shadow-2xs"
                            >
                              <div className="sm:col-span-1 flex items-center justify-between sm:justify-center">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                                  {idx + 1}
                                </span>
                                <span className="sm:hidden text-xs font-bold text-slate-700">Subject #{idx + 1}</span>
                              </div>

                              <div className="sm:col-span-6">
                                <input
                                  type="text"
                                  value={sub.subjectName}
                                  onChange={(e) => handle11thSubjectChange(sub.id, "subjectName", e.target.value)}
                                  autoComplete="off"
                                  placeholder="e.g., Mathematics / Physics / Accountancy"
                                  className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <input
                                  type="number"
                                  value={sub.maxMarks}
                                  onChange={(e) => handle11thSubjectChange(sub.id, "maxMarks", e.target.value)}
                                  autoComplete="off"
                                  placeholder="100"
                                  className="w-full text-center bg-slate-50/70 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <input
                                  type="number"
                                  value={sub.marksObtained}
                                  onChange={(e) => handle11thSubjectChange(sub.id, "marksObtained", e.target.value)}
                                  autoComplete="off"
                                  placeholder="Marks"
                                  className="w-full text-center font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                                />
                              </div>

                              <div className="sm:col-span-1 flex justify-center">
                                {eleventhSubjects.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemove11thSubject(sub.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 rounded-md transition cursor-pointer"
                                    title="Remove subject"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ================= 12th Standard Box ================= */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F7BC0F]/20 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider">
                          12th Standard (HSC Plus Two)
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          School Details & Subject-wise Mark Entry
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            12th School Name
                          </label>
                          <input
                            type="text"
                            name="twelfthSchool"
                            value={formData.twelfthSchool}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter 12th standard school name"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            12th School Address & Location
                          </label>
                          <input
                            type="text"
                            name="twelfthSchoolAddress"
                            value={formData.twelfthSchoolAddress}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter 12th school address, town/village & district"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Subject Group / Stream
                          </label>
                          <input
                            type="text"
                            name="twelfthStream"
                            value={formData.twelfthStream}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="e.g., Bio-Maths / Computer Science / Commerce"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Engineering / Arts Cutoff (out of 200)
                          </label>
                          <input
                            type="text"
                            name="twelfthCutoff"
                            value={formData.twelfthCutoff}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter cutoff marks out of 200"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                          />
                        </div>
                      </div>

                      {/* 12th Subject-wise Mark Entry Table */}
                      <div className="pt-3 border-t border-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div>
                            <h5 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                              12th Standard Subject-wise Mark Entry
                            </h5>
                            <p className="text-[11px] text-slate-500 font-primary">
                              Enter marks obtained in each 12th standard subject out of maximum marks.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {calc12thTotal().total > 0 && (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                                Total: {calc12thTotal().total} / {calc12thTotal().max} ({((calc12thTotal().total / (calc12thTotal().max || 1)) * 100).toFixed(1)}%)
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={handleAdd12thSubject}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-heading font-bold text-xs rounded-lg transition cursor-pointer"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                              <span>+ Add Subject</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[11px] font-heading font-bold text-slate-600 px-3 pb-1">
                            <span className="col-span-1 text-center">#</span>
                            <span className="col-span-6">Subject Name</span>
                            <span className="col-span-2 text-center">Max Marks</span>
                            <span className="col-span-2 text-center">Marks Obtained</span>
                            <span className="col-span-1 text-center">Action</span>
                          </div>

                          {twelfthSubjects.map((sub, idx) => (
                            <div
                              key={sub.id}
                              className="bg-white border border-slate-200 rounded-xl p-3 sm:p-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center shadow-2xs"
                            >
                              <div className="sm:col-span-1 flex items-center justify-between sm:justify-center">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                                  {idx + 1}
                                </span>
                                <span className="sm:hidden text-xs font-bold text-slate-700">Subject #{idx + 1}</span>
                              </div>

                              <div className="sm:col-span-6">
                                <input
                                  type="text"
                                  value={sub.subjectName}
                                  onChange={(e) => handle12thSubjectChange(sub.id, "subjectName", e.target.value)}
                                  autoComplete="off"
                                  placeholder="e.g., Mathematics / Physics / Accountancy"
                                  className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <input
                                  type="number"
                                  value={sub.maxMarks}
                                  onChange={(e) => handle12thSubjectChange(sub.id, "maxMarks", e.target.value)}
                                  autoComplete="off"
                                  placeholder="100"
                                  className="w-full text-center bg-slate-50/70 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <input
                                  type="number"
                                  value={sub.marksObtained}
                                  onChange={(e) => handle12thSubjectChange(sub.id, "marksObtained", e.target.value)}
                                  autoComplete="off"
                                  placeholder="Marks"
                                  className="w-full text-center font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-1 focus:ring-[#F7BC0F]"
                                />
                              </div>

                              <div className="sm:col-span-1 flex justify-center">
                                {twelfthSubjects.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemove12thSubject(sub.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 rounded-md transition cursor-pointer"
                                    title="Remove subject"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 4: PREFERENCES ================= */}
                {activeTab === "preferences" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Section 4: Preferred College & Degree
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tell us which courses you aspire to study in our Tier-1 partner colleges.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Preferred Degree */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Target Degree Program
                        </label>
                        <select
                          name="preferredDegree"
                          value={formData.preferredDegree}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Target Degree</option>
                          <option value="Engineering (B.E / B.Tech)">Engineering (B.E / B.Tech)</option>
                          <option value="Arts & Science (B.Sc / B.A)">Arts & Science (B.Sc / B.A)</option>
                          <option value="Nursing / Paramedical">Nursing / Paramedical</option>
                          <option value="Commerce & Management (B.Com / BBA)">Commerce & Management (B.Com / BBA)</option>
                          <option value="Agriculture (B.Sc Agri / Horti)">Agriculture (B.Sc Agri / Horti)</option>
                        </select>
                      </div>

                      {/* Preferred Branch 1 */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          1st Choice Department / Specialization
                        </label>
                        <input
                          type="text"
                          name="preferredBranch"
                          value={formData.preferredBranch}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter 1st choice course / department"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Preferred Branch 2 */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          2nd Choice Department / Specialization
                        </label>
                        <input
                          type="text"
                          name="secondBranch"
                          value={formData.secondBranch}
                          onChange={handleChange}
                          autoComplete="off"
                          placeholder="Enter 2nd choice course / department"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Location Preference */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Location Preference
                        </label>
                        <select
                          name="preferredLocation"
                          value={formData.preferredLocation}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Location Preference</option>
                          <option value="Chennai / Coimbatore">Chennai / Coimbatore Tier-1 Colleges</option>
                          <option value="Madurai / Southern TN">Madurai / Southern Tamil Nadu</option>
                          <option value="Any Institution">Any Reputed Partner Institution in Tamil Nadu</option>
                        </select>
                      </div>

                      {/* Hostel */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Accommodation Requirement
                        </label>
                        <select
                          name="hostelRequired"
                          value={formData.hostelRequired}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Accommodation Preference</option>
                          <option value="Yes">Yes (Hostel accommodation required)</option>
                          <option value="No">No (Day scholar from home)</option>
                        </select>
                      </div>

                      {/* Career Goal */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Tell us briefly about your dream career goal
                        </label>
                        <textarea
                          name="careerGoal"
                          rows={2}
                          value={formData.careerGoal}
                          onChange={handleChange}
                          placeholder="Describe your career goals and future ambitions..."
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 5: DOCUMENTS & DECLARATION ================= */}
                {activeTab === "documents" && (
                  <div className="space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Section 5: Supporting Documents & Self Declaration
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Upload or verify copies of 10th, 11th, 12th marksheets and Aadhaar card.
                      </p>
                    </div>

                    {/* Upload Rows */}
                    <div className="space-y-3">
                      {[
                        { title: "10th Standard Marksheet", desc: "SSLC statement of marks (PDF/JPG)", status: "Ready to Upload" },
                        { title: "11th Standard Marksheet", desc: "Plus One statement of marks (PDF/JPG)", status: "Ready to Upload" },
                        { title: "12th Standard Marksheet", desc: "HSC statement of marks or provisional result", status: "Ready to Upload" },
                        { title: "Student Aadhaar Card", desc: "Front & back clear copy (PDF/JPG)", status: "Ready to Upload" },
                      ].map((doc, idx) => (
                        <div key={idx} className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                              <CloudArrowUpIcon className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <span className="font-heading font-bold text-xs text-slate-900 block">
                                {doc.title}
                              </span>
                              <span className="text-[11px] text-slate-500 font-primary">
                                {doc.desc}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Choose File
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legal Declaration Checkbox */}
                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl mt-4">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="declarationAgreed"
                          checked={formData.declarationAgreed}
                          onChange={handleChange}
                          required
                          className="w-4 h-4 rounded border-slate-300 bg-white text-slate-900 focus:ring-0 accent-slate-900 cursor-pointer mt-0.5"
                        />
                        <span className="text-xs text-slate-700 font-primary leading-relaxed">
                          I hereby declare that all details submitted above are accurate and true to the best of my knowledge. I understand that Maatram Foundation provides <strong>100% cost-free scholarship sponsorships</strong> without collecting any donation or admission fee.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Controls / Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      {isSaved ? "✓ Draft Saved!" : "Save Draft"}
                    </button>
                    {isSaved && (
                      <span className="text-xs text-emerald-600 font-medium">
                        Changes saved locally
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTab !== "documents" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const tabOrder = ["personal", "family", "academic", "preferences", "documents"] as const;
                          const nextIndex = tabOrder.indexOf(activeTab as typeof tabOrder[number]) + 1;
                          if (nextIndex < tabOrder.length) {
                            setActiveTab(tabOrder[nextIndex]);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>Next Section</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-[#F7BC0F] hover:bg-[#e5ad0c] active:scale-[0.99] text-slate-950 font-heading font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md shadow-[#F7BC0F]/30 hover:shadow-lg transition-all cursor-pointer border border-[#e5ad0c]"
                      >
                        <EyeIcon className="w-4 h-4 stroke-[2.5]" />
                        <span>Check Details & Review Application</span>
                      </button>
                    )}
                  </div>
                </div>

              </form>
            </div>
        )}

      </main>
      
      {/* ================= SIGN OUT CONFIRMATION MODAL ================= */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          authApi.logout();
          setShowSignOutModal(false);
          router.push("/");
        }}
      />
    </div>
  );
}

