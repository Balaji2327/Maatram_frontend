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
  CurrencyRupeeIcon,
  SparklesIcon,
  IdentificationIcon,
  CheckBadgeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export type ApplicationTabType =
  | "personal"
  | "family"
  | "siblings"
  | "address"
  | "educational"
  | "financial"
  | "background"
  | "documents";

export default function DashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ApplicationTabType>("personal");
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

  // Initial state empty with comprehensive fields covering Sections A to H
  const [formData, setFormData] = useState({
    applicationNumber: "",

    // A. Personal Information
    fullName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    mobileNumber: "",
    whatsappNumber: "",
    altMobileNumber: "",
    email: "",
    aadhaarNumber: "",
    community: "",
    nationality: "Indian",
    maritalStatus: "Single",

    // B. Family Information
    fatherName: "",
    fatherOccupation: "",
    fatherMonthlyIncome: "",
    fatherEmploymentStatus: "",
    motherName: "",
    motherOccupation: "",
    motherMonthlyIncome: "",
    motherEmploymentStatus: "",
    annualIncome: "",
    familyMembersCount: "",
    familyType: "Nuclear",
    familySituation: "Both parents",
    guardianName: "",
    guardianOccupation: "",
    guardianMonthlyIncome: "",
    guardianRelation: "",

    // C. Siblings Information
    siblingCount: "",
    siblingsStudyingCount: "",

    // D. Address Information
    permanentAddress: "",
    currentAddress: "",
    sameAsPermanent: true,
    address: "",
    villageTown: "",
    district: "",
    state: "Tamil Nadu",
    pincode: "",
    residenceType: "Own",
    collegeDistance: "",

    // E. Educational Information
    tenthSchool: "",
    tenthBoard: "State Board",
    tenthYear: "",
    tenthTotalMarks: "",
    tenthPercentage: "",
    tenthSchoolAddress: "",

    twelfthSchool: "",
    twelfthBoard: "State Board",
    twelfthYear: "",
    twelfthStream: "",
    twelfthTotalMarks: "",
    twelfthCutoff: "",
    twelfthPercentage: "",
    twelfthSchoolAddress: "",
    mediumOfInstruction: "Tamil",
    firstGraduate: "Yes",
    preferredDegree: "",
    preferredBranch: "",
    secondBranch: "",
    preferredCollegeLocation: "",
    hostelRequired: "Yes",
    careerGoal: "",

    // F. Financial Information
    monthlyFamilyIncome: "",
    incomeSources: "",
    familyDebts: "",
    educationLoans: "",
    financialDifficulties: "",
    whyNeedSupport: "",
    affordabilityWithoutSupport: "",

    // G. Personal and Background Information
    orphan: "No",
    singleParent: "No",
    firstGenerationLearner: "Yes",
    specialCircumstances: "",
    careerAmbition: "",
    higherEducationReason: "",
    willingToRelocateTN: "Yes",
    futureGoals: "",

    // H. Document Uploads
    studentPhoto: "",
    document10thMarksheet: "",
    document12thMarksheet: "",
    documentCommunityCertificate: "",
    documentIncomeCertificate: "",
    documentAadhaarCard: "",
    documentParentIdProof: "",

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

  const handleFileUpload = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: reader.result,
        }));
      }
    };
    reader.readAsDataURL(file);
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
                    A. Personal Information
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
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Student Full Name</span>
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
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Mobile Number</span>
                    <strong className="text-slate-900 font-mono">{formData.mobileNumber || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">WhatsApp Number</span>
                    <strong className="text-slate-900 font-mono">{formData.whatsappNumber || formData.mobileNumber || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Email Address</span>
                    <strong className="text-slate-900">{formData.email || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Aadhaar Number</span>
                    <strong className="text-slate-900 font-mono">{formData.aadhaarNumber || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Community / Category</span>
                    <strong className="text-slate-900">{formData.community || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Nationality</span>
                    <strong className="text-slate-900">{formData.nationality || "Indian"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Marital Status</span>
                    <strong className="text-slate-900">{formData.maritalStatus || "Single"}</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Family Details */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <HomeModernIcon className="w-4 h-4 text-[#F7BC0F]" />
                    B. Family Information
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
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Father's Name</span>
                    <strong className="text-slate-900">{formData.fatherName || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Father's Occupation</span>
                    <strong className="text-slate-900">{formData.fatherOccupation || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Father's Monthly Income</span>
                    <strong className="text-slate-900">{formData.fatherMonthlyIncome || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Father's Employment Status</span>
                    <strong className="text-slate-900">{formData.fatherEmploymentStatus || "-"}</strong>
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
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Mother's Monthly Income</span>
                    <strong className="text-slate-900">{formData.motherMonthlyIncome || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Mother's Employment Status</span>
                    <strong className="text-slate-900">{formData.motherEmploymentStatus || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Total Family Annual Income</span>
                    <strong className="text-slate-900 font-semibold">{formData.annualIncome || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Number of Family Members</span>
                    <strong className="text-slate-900">{formData.familyMembersCount || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Family Type</span>
                    <strong className="text-slate-900">{formData.familyType || "Nuclear"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Family Situation</span>
                    <strong className="text-slate-900">{formData.familySituation || "Both parents"}</strong>
                  </div>
                  {formData.guardianName && (
                    <>
                      <div>
                        <span className="text-[11px] text-slate-500 block uppercase font-medium">Guardian's Name</span>
                        <strong className="text-slate-900">{formData.guardianName}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block uppercase font-medium">Guardian's Occupation</span>
                        <strong className="text-slate-900">{formData.guardianOccupation || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block uppercase font-medium">Guardian's Monthly Income</span>
                        <strong className="text-slate-900">{formData.guardianMonthlyIncome || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block uppercase font-medium">Guardian Relationship</span>
                        <strong className="text-slate-900">{formData.guardianRelation || "-"}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section 3: Siblings Information */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <UserGroupIcon className="w-4 h-4 text-[#F7BC0F]" />
                    C. Siblings Information
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("siblings");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Section
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Number of Siblings</span>
                    <strong className="text-slate-900">{formData.siblingCount || siblings.length || "0"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Siblings Currently Studying</span>
                    <strong className="text-slate-900">{formData.siblingsStudyingCount || "0"}</strong>
                  </div>
                </div>

                {siblings.length > 0 ? (
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
                ) : (
                  <p className="text-xs text-slate-500 italic">No siblings entered.</p>
                )}
              </div>

              {/* Section 4: Address Information */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-[#F7BC0F]" />
                    D. Address Information
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("address");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Section
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Permanent Address</span>
                    <strong className="text-slate-900">{formData.permanentAddress || formData.address || "-"}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Current Residential Address</span>
                    <strong className="text-slate-900">
                      {formData.sameAsPermanent ? (formData.permanentAddress || formData.address || "-") : (formData.currentAddress || "-")}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Village / Town</span>
                    <strong className="text-slate-900">{formData.villageTown || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">District</span>
                    <strong className="text-slate-900">{formData.district || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">State</span>
                    <strong className="text-slate-900">{formData.state || "Tamil Nadu"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">PIN Code</span>
                    <strong className="text-slate-900 font-mono">{formData.pincode || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Residence Type</span>
                    <strong className="text-slate-900">{formData.residenceType || "Own"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Distance from Nearest College</span>
                    <strong className="text-slate-900">{formData.collegeDistance || "-"}</strong>
                  </div>
                </div>
              </div>

              {/* Section 5: Educational Information */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4 text-[#F7BC0F]" />
                    E. Educational Information
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("educational");
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
                      <span className="text-[11px] text-slate-500 block uppercase">10th School Name</span>
                      <strong className="text-slate-900">{formData.tenthSchool || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">10th Board</span>
                      <strong className="text-slate-900">{formData.tenthBoard || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">10th Passing Year</span>
                      <strong className="text-slate-900">{formData.tenthYear || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">10th Percentage</span>
                      <strong className="text-slate-900">{formData.tenthPercentage || "-"}%</strong>
                    </div>
                  </div>
                </div>

                {/* 12th Standard Summary & Mark Table */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    <span>12th Standard (HSC Plus Two)</span>
                    <span className="text-emerald-700 font-mono text-xs font-black">
                      Total: {formData.twelfthTotalMarks || calc12thTotal().total} | Cutoff: {formData.twelfthCutoff || "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">12th School Name</span>
                      <strong className="text-slate-900">{formData.twelfthSchool || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">12th Board</span>
                      <strong className="text-slate-900">{formData.twelfthBoard || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">12th Passing Year</span>
                      <strong className="text-slate-900">{formData.twelfthYear || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">12th Group</span>
                      <strong className="text-slate-900">{formData.twelfthStream || "-"}</strong>
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

                  {/* Course Preferences */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">First-Gen Graduate</span>
                      <strong className="text-slate-900">{formData.firstGraduate || "Yes"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Preferred Degree</span>
                      <strong className="text-slate-900">{formData.preferredDegree || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Preferred Course (1st / 2nd)</span>
                      <strong className="text-slate-900">{formData.preferredBranch || "-"} {formData.secondBranch ? `/ ${formData.secondBranch}` : ""}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block uppercase">Preferred College / Location</span>
                      <strong className="text-slate-900">{formData.preferredCollegeLocation || "-"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Financial Information */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <CurrencyRupeeIcon className="w-4 h-4 text-[#F7BC0F]" />
                    F. Financial Information
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("financial");
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
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Annual Family Income</span>
                    <strong className="text-slate-900">{formData.annualIncome || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Monthly Family Income</span>
                    <strong className="text-slate-900">{formData.monthlyFamilyIncome || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Income Sources</span>
                    <strong className="text-slate-900">{formData.incomeSources || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Family Debts</span>
                    <strong className="text-slate-900">{formData.familyDebts || "None"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Existing Education Loans</span>
                    <strong className="text-slate-900">{formData.educationLoans || "None"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Ability to Afford College</span>
                    <strong className="text-slate-900">{formData.affordabilityWithoutSupport || "Cannot afford without 100% scholarship"}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Financial Difficulties Faced</span>
                    <p className="text-slate-800 mt-0.5">{formData.financialDifficulties || "—"}</p>
                  </div>
                  <div className="sm:col-span-4">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Why the Student Needs Financial Support</span>
                    <p className="text-slate-800 mt-0.5">{formData.whyNeedSupport || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Section 7: Personal and Background Information */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-[#F7BC0F]" />
                    G. Personal and Background Information
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewOpen(false);
                      setActiveTab("background");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-[#b48400] hover:underline flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Section
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Orphan Status</span>
                    <strong className="text-slate-900">{formData.orphan || "No"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Single-Parent Status</span>
                    <strong className="text-slate-900">{formData.singleParent || "No"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">First-Generation Learner</span>
                    <strong className="text-slate-900">{formData.firstGenerationLearner || "Yes"}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Willingness to Relocate in TN</span>
                    <strong className="text-slate-900">{formData.willingToRelocateTN || "Yes"}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Career Ambition</span>
                    <p className="text-slate-800 mt-0.5">{formData.careerAmbition || formData.careerGoal || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Why the Student Wants Higher Education</span>
                    <p className="text-slate-800 mt-0.5">{formData.higherEducationReason || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Future Goals</span>
                    <p className="text-slate-800 mt-0.5">{formData.futureGoals || "—"}</p>
                  </div>
                  {formData.specialCircumstances && (
                    <div className="sm:col-span-2">
                      <span className="text-[11px] text-slate-500 block uppercase font-medium">Special Family Circumstances</span>
                      <p className="text-slate-800 mt-0.5">{formData.specialCircumstances}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 8: Document Uploads Checklist */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-[#F7BC0F]" />
                    H. Document Uploads
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-900">Student Photograph</span>
                    <span className={`text-[11px] font-bold ${formData.studentPhoto ? "text-emerald-600" : "text-amber-600"}`}>
                      {formData.studentPhoto ? "✓ Attached" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-900">10th Marksheet</span>
                    <span className={`text-[11px] font-bold ${formData.document10thMarksheet ? "text-emerald-600" : "text-amber-600"}`}>
                      {formData.document10thMarksheet ? "✓ Attached" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-900">12th Marksheet</span>
                    <span className={`text-[11px] font-bold ${formData.document12thMarksheet ? "text-emerald-600" : "text-amber-600"}`}>
                      {formData.document12thMarksheet ? "✓ Attached" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-900">Community Certificate</span>
                    <span className={`text-[11px] font-bold ${formData.documentCommunityCertificate ? "text-emerald-600" : "text-slate-400"}`}>
                      {formData.documentCommunityCertificate ? "✓ Attached" : "Optional"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-900">Income Certificate</span>
                    <span className={`text-[11px] font-bold ${formData.documentIncomeCertificate ? "text-emerald-600" : "text-slate-400"}`}>
                      {formData.documentIncomeCertificate ? "✓ Attached" : "Optional"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-900">Aadhaar Document</span>
                    <span className={`text-[11px] font-bold ${formData.documentAadhaarCard ? "text-emerald-600" : "text-slate-400"}`}>
                      {formData.documentAadhaarCard ? "✓ Attached" : "Optional"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 sm:col-span-2 md:col-span-1">
                    <span className="font-medium text-slate-900">Parent / Guardian ID Proof</span>
                    <span className={`text-[11px] font-bold ${formData.documentParentIdProof ? "text-emerald-600" : "text-slate-400"}`}>
                      {formData.documentParentIdProof ? "✓ Attached" : "Optional"}
                    </span>
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

                {/* Navigation Section Tabs - 8 Tabs A to H */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mt-6 overflow-x-auto scrollbar-none">
                  {[
                    { id: "personal", label: "Personal", icon: UserIcon },
                    { id: "family", label: "Family", icon: HomeModernIcon },
                    { id: "siblings", label: "Siblings", icon: UserGroupIcon },
                    { id: "address", label: "Address", icon: MapPinIcon },
                    { id: "educational", label: "Educational", icon: AcademicCapIcon },
                    { id: "financial", label: "Financial", icon: CurrencyRupeeIcon },
                    { id: "background", label: "Background", icon: SparklesIcon },
                    { id: "documents", label: "Documents", icon: DocumentTextIcon },
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
                
                {/* ================= TAB 1: PERSONAL INFORMATION ================= */}
                {activeTab === "personal" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Personal Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please provide accurate identity and personal communication details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Student Full Name */}
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Student Full Name <span className="text-rose-500">*</span> (as in 10th / 12th certificate)
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Date of Birth <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Gender <span className="text-rose-500">*</span>
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
                          placeholder="e.g., O+, A+, B+, AB+"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="10-digit primary mobile"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* WhatsApp Number */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleChange}
                          placeholder="WhatsApp contact number"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Aadhaar Number */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Aadhaar Number <span className="text-slate-400 font-normal">(only if officially required)</span>
                        </label>
                        <input
                          type="text"
                          name="aadhaarNumber"
                          value={formData.aadhaarNumber}
                          onChange={handleChange}
                          maxLength={12}
                          placeholder="12-digit Aadhaar number"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition font-mono"
                        />
                      </div>

                      {/* Community / Category */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Community / Category <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="community"
                          value={formData.community}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Community</option>
                          <option value="BC">BC (Backward Class)</option>
                          <option value="BCM">BCM (Backward Class Muslim)</option>
                          <option value="MBC">MBC (Most Backward Class)</option>
                          <option value="DNC">DNC (De-notified Community)</option>
                          <option value="SC">SC (Scheduled Caste)</option>
                          <option value="SCA">SCA (Scheduled Caste Arunthathiyar)</option>
                          <option value="ST">ST (Scheduled Tribe)</option>
                          <option value="OC">OC (Open Competition / General)</option>
                        </select>
                      </div>

                      {/* Nationality */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Nationality
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          placeholder="Indian"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Marital Status */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Marital Status
                        </label>
                        <select
                          name="maritalStatus"
                          value={formData.maritalStatus}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="Single">Single / Unmarried</option>
                          <option value="Married">Married</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 2: FAMILY INFORMATION ================= */}
                {activeTab === "family" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Family Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please provide truthful details regarding parents, occupations, income, and family situation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Father's Name */}
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                          placeholder="Father's full name"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Father's Occupation */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Father's Occupation
                        </label>
                        <input
                          type="text"
                          name="fatherOccupation"
                          value={formData.fatherOccupation}
                          onChange={handleChange}
                          placeholder="e.g., Daily wage labourer, Farmer"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Father's Monthly Income */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Father's Monthly Income (₹)
                        </label>
                        <input
                          type="text"
                          name="fatherMonthlyIncome"
                          value={formData.fatherMonthlyIncome}
                          onChange={handleChange}
                          placeholder="e.g., ₹6,000"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Father's Employment Status */}
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Father's Employment Status
                        </label>
                        <select
                          name="fatherEmploymentStatus"
                          value={formData.fatherEmploymentStatus}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Employment Status</option>
                          <option value="Employed (Daily Wage / Unorganized)">Employed (Daily Wage / Unorganized)</option>
                          <option value="Self-Employed / Small Agriculture">Self-Employed / Small Agriculture</option>
                          <option value="Salaried Employee">Salaried Employee</option>
                          <option value="Unemployed / Sick">Unemployed / Medically Unfit</option>
                          <option value="Deceased">Deceased</option>
                        </select>
                      </div>

                      {/* Mother's Name */}
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Mother's Name
                        </label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                          placeholder="Mother's full name"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Mother's Occupation */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Mother's Occupation
                        </label>
                        <input
                          type="text"
                          name="motherOccupation"
                          value={formData.motherOccupation}
                          onChange={handleChange}
                          placeholder="e.g., Homemaker, Domestic helper"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Mother's Monthly Income */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Mother's Monthly Income (₹)
                        </label>
                        <input
                          type="text"
                          name="motherMonthlyIncome"
                          value={formData.motherMonthlyIncome}
                          onChange={handleChange}
                          placeholder="e.g., ₹3,000"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Mother's Employment Status */}
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Mother's Employment Status
                        </label>
                        <select
                          name="motherEmploymentStatus"
                          value={formData.motherEmploymentStatus}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Employment Status</option>
                          <option value="Homemaker">Homemaker</option>
                          <option value="Daily Wage / Agricultural Worker">Daily Wage / Agricultural Worker</option>
                          <option value="Self-Employed / Tailoring">Self-Employed / Tailoring</option>
                          <option value="Salaried Employee">Salaried Employee</option>
                          <option value="Deceased">Deceased</option>
                        </select>
                      </div>

                      {/* Total Family Annual Income */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Total Family Annual Income <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="annualIncome"
                          value={formData.annualIncome}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="">Select Annual Income</option>
                          <option value="Below ₹40,000">Below ₹40,000</option>
                          <option value="₹40,000 - ₹72,000">₹40,000 - ₹72,000</option>
                          <option value="₹72,000 - ₹1,00,000">₹72,000 - ₹1,00,000</option>
                          <option value="₹1,00,000 - ₹1,50,000">₹1,00,000 - ₹1,50,000</option>
                          <option value="Above ₹1,50,000">Above ₹1,50,000</option>
                        </select>
                      </div>

                      {/* Number of Family Members */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Number of Family Members
                        </label>
                        <input
                          type="number"
                          name="familyMembersCount"
                          value={formData.familyMembersCount}
                          onChange={handleChange}
                          placeholder="e.g., 4"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        />
                      </div>

                      {/* Family Type */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Family Type
                        </label>
                        <select
                          name="familyType"
                          value={formData.familyType}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="Nuclear">Nuclear Family</option>
                          <option value="Joint">Joint Family</option>
                        </select>
                      </div>

                      {/* Family Situation */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Family Situation <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="familySituation"
                          value={formData.familySituation}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white focus:ring-2 focus:ring-[#F7BC0F]/40 transition"
                        >
                          <option value="Both parents">Both parents alive & together</option>
                          <option value="Single parent (Mother)">Single parent (Mother alone)</option>
                          <option value="Single parent (Father)">Single parent (Father alone)</option>
                          <option value="Orphan">Orphan (Both parents deceased / Destitute)</option>
                        </select>
                      </div>

                      {/* Guardian Details (if applicable) */}
                      <div className="lg:col-span-4 pt-4 border-t border-slate-200">
                        <span className="font-heading font-bold text-xs text-slate-900 block mb-2">
                          Guardian Details (if applicable / supported by relative or legal guardian)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Guardian Name</label>
                            <input
                              type="text"
                              name="guardianName"
                              value={formData.guardianName}
                              onChange={handleChange}
                              placeholder="Guardian's name"
                              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Relationship to Student</label>
                            <input
                              type="text"
                              name="guardianRelation"
                              value={formData.guardianRelation}
                              onChange={handleChange}
                              placeholder="e.g., Uncle, Grandmother"
                              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Guardian Occupation</label>
                            <input
                              type="text"
                              name="guardianOccupation"
                              value={formData.guardianOccupation}
                              onChange={handleChange}
                              placeholder="Occupation"
                              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Guardian Monthly Income</label>
                            <input
                              type="text"
                              name="guardianMonthlyIncome"
                              value={formData.guardianMonthlyIncome}
                              onChange={handleChange}
                              placeholder="Monthly Income (₹)"
                              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 3: SIBLINGS INFORMATION ================= */}
                {activeTab === "siblings" && (
                  <div className="space-y-5">
                    <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-heading font-bold text-base text-slate-900">
                          Siblings Information
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Record your brothers and sisters, their ages, schooling status, and occupations.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddSibling}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-[#F7BC0F]/20 text-slate-900 border border-[#F7BC0F] font-heading font-bold text-xs rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer"
                      >
                        <PlusIcon className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                        <span>+ Add Sibling</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Total Number of Siblings
                        </label>
                        <input
                          type="number"
                          name="siblingCount"
                          value={formData.siblingCount || (siblings.length ? String(siblings.length) : "")}
                          onChange={handleChange}
                          placeholder="e.g., 2"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Number of Siblings Currently Studying
                        </label>
                        <input
                          type="number"
                          name="siblingsStudyingCount"
                          value={formData.siblingsStudyingCount}
                          onChange={handleChange}
                          placeholder="e.g., 1"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>
                    </div>

                    {siblings.length === 0 ? (
                      <div className="bg-slate-50/70 border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                          <UserGroupIcon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-2">No siblings added yet</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                          If you have brothers or sisters, click "+ Add Sibling" to record their education and occupation.
                        </p>
                        <button
                          type="button"
                          onClick={handleAddSibling}
                          className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-heading font-bold text-xs rounded-lg transition cursor-pointer"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>+ Add Sibling Details</span>
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
                              >
                                <TrashIcon className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                              <div>
                                <label className="block text-xs font-heading font-bold text-slate-800">
                                  Sibling's Full Name
                                </label>
                                <input
                                  type="text"
                                  value={sibling.name}
                                  onChange={(e) => handleSiblingChange(sibling.id, "name", e.target.value)}
                                  placeholder="Enter sibling's name"
                                  className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-heading font-bold text-slate-800">
                                  Relationship
                                </label>
                                <select
                                  value={sibling.relationship}
                                  onChange={(e) => handleSiblingChange(sibling.id, "relationship", e.target.value)}
                                  className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                                >
                                  <option value="">Select Relationship</option>
                                  <option value="Elder Brother">Elder Brother</option>
                                  <option value="Younger Brother">Younger Brother</option>
                                  <option value="Elder Sister">Elder Sister</option>
                                  <option value="Younger Sister">Younger Sister</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-heading font-bold text-slate-800">
                                  Age
                                </label>
                                <input
                                  type="text"
                                  value={sibling.age}
                                  onChange={(e) => handleSiblingChange(sibling.id, "age", e.target.value)}
                                  placeholder="e.g., 18"
                                  className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F]"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-heading font-bold text-slate-800">
                                  Sibling Education Level
                                </label>
                                <input
                                  type="text"
                                  value={sibling.education}
                                  onChange={(e) => handleSiblingChange(sibling.id, "education", e.target.value)}
                                  placeholder="e.g., 10th Std / B.Sc / 12th Std"
                                  className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F]"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-xs font-heading font-bold text-slate-800">
                                  Sibling Occupation / Institution
                                </label>
                                <input
                                  type="text"
                                  value={sibling.institution}
                                  onChange={(e) => handleSiblingChange(sibling.id, "institution", e.target.value)}
                                  placeholder="e.g., Student @ Govt HSS / Employed at Textile Mill"
                                  className="w-full mt-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ================= TAB 4: ADDRESS INFORMATION ================= */}
                {activeTab === "address" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Address Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please provide permanent and current living address details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Permanent Address */}
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Permanent Address <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="permanentAddress"
                          rows={2}
                          value={formData.permanentAddress || formData.address}
                          onChange={handleChange}
                          placeholder="Door no., street name, village / post"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Same as Permanent Checkbox */}
                      <div className="sm:col-span-2 lg:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          id="sameAsPerm"
                          name="sameAsPermanent"
                          checked={formData.sameAsPermanent}
                          onChange={handleChange}
                          className="w-4 h-4 rounded text-slate-900 border-slate-300"
                        />
                        <label htmlFor="sameAsPerm" className="text-xs font-bold text-slate-800 cursor-pointer">
                          Current residential address is same as permanent address
                        </label>
                      </div>

                      {/* Current Residential Address */}
                      {!formData.sameAsPermanent && (
                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Current Residential Address
                          </label>
                          <textarea
                            name="currentAddress"
                            rows={2}
                            value={formData.currentAddress}
                            onChange={handleChange}
                            placeholder="Current residence address"
                            className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                          />
                        </div>
                      )}

                      {/* Village / Town */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Village / Town <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="villageTown"
                          value={formData.villageTown}
                          onChange={handleChange}
                          placeholder="Village or Town name"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* District */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          District <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="e.g., Tiruvannamalai, Madurai"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Tamil Nadu"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* PIN code */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          PIN Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="6-digit PIN code"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white font-mono"
                        />
                      </div>

                      {/* Residence Type */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Residence Type (Own / Rented)
                        </label>
                        <select
                          name="residenceType"
                          value={formData.residenceType}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        >
                          <option value="Own">Own House (Thatched / Tiled / Concrete)</option>
                          <option value="Rented">Rented House</option>
                          <option value="Relatives house / Shelter">Living in Relatives' House / Shelter</option>
                        </select>
                      </div>

                      {/* Distance from nearest college */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Distance from Nearest College (km)
                        </label>
                        <input
                          type="text"
                          name="collegeDistance"
                          value={formData.collegeDistance}
                          onChange={handleChange}
                          placeholder="e.g., 15 km"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 5: EDUCATIONAL INFORMATION ================= */}
                {activeTab === "educational" && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Educational Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Enter 10th and 12th standard marks, school details, and preferred degree courses.
                      </p>
                    </div>

                    {/* 10th Standard Card */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F7BC0F]/20 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider">
                        10th Standard (SSLC) Information
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th School Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="tenthSchool"
                            value={formData.tenthSchool}
                            onChange={handleChange}
                            placeholder="Enter 10th school name"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th Board
                          </label>
                          <select
                            name="tenthBoard"
                            value={formData.tenthBoard}
                            onChange={handleChange}
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          >
                            <option value="State Board">Tamil Nadu State Board</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="Matriculation">Matriculation</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th Passing Year
                          </label>
                          <input
                            type="text"
                            name="tenthYear"
                            value={formData.tenthYear}
                            onChange={handleChange}
                            placeholder="e.g., 2023"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th Total Marks (out of 500)
                          </label>
                          <input
                            type="text"
                            name="tenthTotalMarks"
                            value={formData.tenthTotalMarks}
                            onChange={handleChange}
                            placeholder="e.g., 425"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            10th Percentage (%)
                          </label>
                          <input
                            type="text"
                            name="tenthPercentage"
                            value={formData.tenthPercentage}
                            onChange={handleChange}
                            placeholder="e.g., 85%"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 12th Standard Card */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F7BC0F]/20 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider">
                        12th Standard (HSC Plus Two) Information
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            12th School Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="twelfthSchool"
                            value={formData.twelfthSchool}
                            onChange={handleChange}
                            placeholder="Enter 12th school name"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            12th Board
                          </label>
                          <select
                            name="twelfthBoard"
                            value={formData.twelfthBoard}
                            onChange={handleChange}
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          >
                            <option value="State Board">Tamil Nadu State Board</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE / ISC">ICSE / ISC</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            12th Passing Year
                          </label>
                          <input
                            type="text"
                            name="twelfthYear"
                            value={formData.twelfthYear}
                            onChange={handleChange}
                            placeholder="e.g., 2025"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            12th Group / Stream
                          </label>
                          <input
                            type="text"
                            name="twelfthStream"
                            value={formData.twelfthStream}
                            onChange={handleChange}
                            placeholder="e.g., Bio-Maths / CS / Commerce"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Total Marks (out of 600)
                          </label>
                          <input
                            type="text"
                            name="twelfthTotalMarks"
                            value={formData.twelfthTotalMarks}
                            onChange={handleChange}
                            placeholder="Total marks scored"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Percentage (%)
                          </label>
                          <input
                            type="text"
                            name="twelfthPercentage"
                            value={formData.twelfthPercentage}
                            onChange={handleChange}
                            placeholder="Percentage scored"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Cut-off Marks (out of 200) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="twelfthCutoff"
                            value={formData.twelfthCutoff}
                            onChange={handleChange}
                            placeholder="e.g., 185.5"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] font-bold"
                          />
                        </div>
                      </div>

                      {/* Subject-wise marks */}
                      <div className="pt-3 border-t border-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div>
                            <h5 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                              Subject-wise Marks
                            </h5>
                            <p className="text-[11px] text-slate-500 font-primary">
                              Enter marks obtained in each 12th standard subject.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleAdd12thSubject}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-heading font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>+ Add Subject</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {twelfthSubjects.map((sub, idx) => (
                            <div
                              key={sub.id}
                              className="bg-white border border-slate-200 rounded-xl p-3 sm:p-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center"
                            >
                              <div className="sm:col-span-1 flex items-center justify-between sm:justify-center">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                                  {idx + 1}
                                </span>
                              </div>

                              <div className="sm:col-span-6">
                                <input
                                  type="text"
                                  value={sub.subjectName}
                                  onChange={(e) => handle12thSubjectChange(sub.id, "subjectName", e.target.value)}
                                  placeholder="Subject name"
                                  className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <input
                                  type="number"
                                  value={sub.maxMarks}
                                  onChange={(e) => handle12thSubjectChange(sub.id, "maxMarks", e.target.value)}
                                  placeholder="100"
                                  className="w-full text-center bg-slate-50/70 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <input
                                  type="number"
                                  value={sub.marksObtained}
                                  onChange={(e) => handle12thSubjectChange(sub.id, "marksObtained", e.target.value)}
                                  placeholder="Marks"
                                  className="w-full text-center font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                                />
                              </div>

                              <div className="sm:col-span-1 flex justify-center">
                                {twelfthSubjects.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemove12thSubject(sub.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 transition"
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

                    {/* Course & Degree Preferences Card */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F7BC0F]/20 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider">
                        Higher Education Preferences
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            First-Generation Graduate Status
                          </label>
                          <select
                            name="firstGraduate"
                            value={formData.firstGraduate}
                            onChange={handleChange}
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          >
                            <option value="Yes">Yes (First in family to attend college)</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Preferred Degree <span className="text-rose-500">*</span>
                          </label>
                          <select
                            name="preferredDegree"
                            value={formData.preferredDegree}
                            onChange={handleChange}
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          >
                            <option value="">Select Target Degree</option>
                            <option value="Engineering (B.E / B.Tech)">Engineering (B.E / B.Tech)</option>
                            <option value="Arts & Science (B.Sc / B.A)">Arts & Science (B.Sc / B.A)</option>
                            <option value="Commerce (B.Com / BBA)">Commerce (B.Com / BBA)</option>
                            <option value="Nursing / Paramedical">Nursing / Paramedical</option>
                            <option value="Agriculture (B.Sc Agri)">Agriculture (B.Sc Agri)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Preferred Course (1st Choice)
                          </label>
                          <input
                            type="text"
                            name="preferredBranch"
                            value={formData.preferredBranch}
                            onChange={handleChange}
                            placeholder="e.g., Computer Science & Engg"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Preferred Course (2nd Choice)
                          </label>
                          <input
                            type="text"
                            name="secondBranch"
                            value={formData.secondBranch}
                            onChange={handleChange}
                            placeholder="e.g., Electronics & Communication"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Preferred College / Location
                          </label>
                          <input
                            type="text"
                            name="preferredCollegeLocation"
                            value={formData.preferredCollegeLocation}
                            onChange={handleChange}
                            placeholder="e.g., Chennai, Coimbatore, or Anywhere in TN"
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-heading font-bold text-slate-800">
                            Hostel Accommodation Required?
                          </label>
                          <select
                            name="hostelRequired"
                            value={formData.hostelRequired}
                            onChange={handleChange}
                            className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                          >
                            <option value="Yes">Yes - Hostel accommodation required</option>
                            <option value="No">No - Day scholar from home</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 6: FINANCIAL INFORMATION ================= */}
                {activeTab === "financial" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Financial Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please provide detailed and honest disclosure of family finances and difficulties.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Annual family income */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Annual Family Income <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="annualIncome"
                          value={formData.annualIncome}
                          onChange={handleChange}
                          placeholder="e.g., ₹72,000"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Monthly family income */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Monthly Family Income
                        </label>
                        <input
                          type="text"
                          name="monthlyFamilyIncome"
                          value={formData.monthlyFamilyIncome}
                          onChange={handleChange}
                          placeholder="e.g., ₹6,000"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Income sources */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Income Sources
                        </label>
                        <input
                          type="text"
                          name="incomeSources"
                          value={formData.incomeSources}
                          onChange={handleChange}
                          placeholder="e.g., Daily coolie work, Agriculture"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Family debts */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Family Debts (if relevant)
                        </label>
                        <input
                          type="text"
                          name="familyDebts"
                          value={formData.familyDebts}
                          onChange={handleChange}
                          placeholder="e.g., ₹1,20,000 medical/agricultural debt"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Existing education loans */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Existing Education Loans
                        </label>
                        <input
                          type="text"
                          name="educationLoans"
                          value={formData.educationLoans}
                          onChange={handleChange}
                          placeholder="e.g., None, or ₹50,000 loan for elder sibling"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Ability to afford college expenses without support */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Ability to Afford College Expenses Without Support
                        </label>
                        <select
                          name="affordabilityWithoutSupport"
                          value={formData.affordabilityWithoutSupport}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        >
                          <option value="Cannot afford at all">Cannot afford at all (will have to drop out)</option>
                          <option value="Cannot afford private college">Cannot afford private college fees or hostel</option>
                          <option value="Only minimal support">Can manage only travel/minimal personal items</option>
                        </select>
                      </div>

                      {/* Financial difficulties faced by the family */}
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Financial Difficulties Faced by the Family
                        </label>
                        <textarea
                          name="financialDifficulties"
                          rows={2}
                          value={formData.financialDifficulties}
                          onChange={handleChange}
                          placeholder="Describe the economic challenges, irregular income, debts, or hardships faced by your family..."
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Why the student needs financial support */}
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Why the Student Needs Financial Support <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="whyNeedSupport"
                          rows={3}
                          value={formData.whyNeedSupport}
                          onChange={handleChange}
                          placeholder="Explain why Maatram Foundation's 100% free scholarship sponsorship is critical for you to pursue higher education..."
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 7: PERSONAL AND BACKGROUND ================= */}
                {activeTab === "background" && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Personal & Background Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tell us about your ambitions, special family circumstances, and future goals.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Orphan status */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Orphan Status
                        </label>
                        <select
                          name="orphan"
                          value={formData.orphan}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes (Orphan student)</option>
                        </select>
                      </div>

                      {/* Single-parent status */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Single-Parent Status
                        </label>
                        <select
                          name="singleParent"
                          value={formData.singleParent}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        >
                          <option value="No">No (Both parents alive)</option>
                          <option value="Single Mother">Single Parent - Mother</option>
                          <option value="Single Father">Single Parent - Father</option>
                        </select>
                      </div>

                      {/* First-generation learner */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          First-Generation Learner
                        </label>
                        <select
                          name="firstGenerationLearner"
                          value={formData.firstGenerationLearner}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        >
                          <option value="Yes">Yes (First to attend college)</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {/* Willingness to relocate anywhere in Tamil Nadu */}
                      <div>
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Willingness to Relocate in Tamil Nadu
                        </label>
                        <select
                          name="willingToRelocateTN"
                          value={formData.willingToRelocateTN}
                          onChange={handleChange}
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        >
                          <option value="Yes">Yes - Ready to study anywhere in TN</option>
                          <option value="No">No - Prefer nearby colleges only</option>
                        </select>
                      </div>

                      {/* Career ambition */}
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Career Ambition <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="careerAmbition"
                          rows={2}
                          value={formData.careerAmbition || formData.careerGoal}
                          onChange={handleChange}
                          placeholder="e.g., Software Engineer, IAS officer, Bank Manager, Teacher"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Why the student wants higher education */}
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Why the Student Wants Higher Education <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="higherEducationReason"
                          rows={2}
                          value={formData.higherEducationReason}
                          onChange={handleChange}
                          placeholder="Why is completing a college degree important for you and your family?"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Future goals */}
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Future Goals & Vision
                        </label>
                        <textarea
                          name="futureGoals"
                          rows={2}
                          value={formData.futureGoals}
                          onChange={handleChange}
                          placeholder="What do you plan to achieve after graduating?"
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>

                      {/* Special family circumstances */}
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-xs font-heading font-bold text-slate-800">
                          Special Family Circumstances (if any)
                        </label>
                        <textarea
                          name="specialCircumstances"
                          rows={2}
                          value={formData.specialCircumstances}
                          onChange={handleChange}
                          placeholder="e.g., Parent's chronic illness, physical disability, natural disaster loss..."
                          className="w-full mt-1.5 bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TAB 8: DOCUMENT UPLOADS ================= */}
                {activeTab === "documents" && (
                  <div className="space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Document Uploads & Self Declaration
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Upload clear scanned copies or photos (PDF, JPG, PNG up to 5MB each).
                      </p>
                    </div>

                    {/* Upload Rows for All 7 Documents */}
                    <div className="space-y-3">
                      {[
                        { key: "studentPhoto", title: "Student Photograph", desc: "Recent passport size photo of the applicant", required: true },
                        { key: "document10thMarksheet", title: "10th Mark Sheet", desc: "SSLC statement of marks or provisional mark sheet", required: true },
                        { key: "document12thMarksheet", title: "12th Mark Sheet", desc: "HSC +2 statement of marks or internet result copy", required: true },
                        { key: "documentCommunityCertificate", title: "Community Certificate", desc: "Official community certificate issued by Revenue Department", required: false },
                        { key: "documentIncomeCertificate", title: "Income Certificate", desc: "Tahsildar / Village Administrative Officer income proof", required: false },
                        { key: "documentAadhaarCard", title: "Aadhaar Document", desc: "Front & back copy of student Aadhaar card (if required)", required: false },
                        { key: "documentParentIdProof", title: "Parent / Guardian Identity Proof", desc: "Aadhaar or Voter ID of parent / guardian (if required)", required: false },
                      ].map((doc) => {
                        const isAttached = Boolean((formData as any)[doc.key]);
                        return (
                          <div
                            key={doc.key}
                            className={`flex flex-wrap items-center justify-between p-4 rounded-2xl border transition ${
                              isAttached ? "bg-emerald-50/60 border-emerald-300" : "bg-slate-50 border-slate-200"
                            } gap-3`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isAttached ? "bg-emerald-100 text-emerald-700" : "bg-white border border-slate-200 text-slate-500"
                                }`}
                              >
                                {isAttached ? <CheckBadgeIcon className="w-6 h-6" /> : <CloudArrowUpIcon className="w-6 h-6" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                                    {doc.title}
                                  </span>
                                  {doc.required && (
                                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                      Required
                                    </span>
                                  )}
                                  {isAttached && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                                      ✓ Uploaded
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500 font-primary block mt-0.5">
                                  {doc.desc}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <label className="text-xs font-heading font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-2xs">
                                <span>{isAttached ? "Change File" : "Choose File"}</span>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(doc.key, e)}
                                />
                              </label>
                              {isAttached && (
                                <button
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, [doc.key]: "" }))}
                                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Remove attachment"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
                        Changes saved locally & to cloud database
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTab !== "documents" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const tabOrder: ApplicationTabType[] = [
                            "personal",
                            "family",
                            "siblings",
                            "address",
                            "educational",
                            "financial",
                            "background",
                            "documents",
                          ];
                          const nextIndex = tabOrder.indexOf(activeTab) + 1;
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

