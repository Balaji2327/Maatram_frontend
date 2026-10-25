"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SignOutModal from "../components/SignOutModal";
import {
  PhoneIcon,
  MapPinIcon,
  VideoCameraIcon,
  CheckBadgeIcon,
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function SelectionProcessScreen() {
  const router = useRouter();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const stages = [
    {
      step: "Stage 01",
      title: "Televerification",
      desc: "Our Maatram counseling team initiates phone verification to cross-check initial academic marks, contact details, family background, and eligibility criteria.",
      status: "In Progress",
      statusColor: "bg-amber-100 text-amber-800 border-amber-300",
      badgeText: "Current Stage",
      icon: PhoneIcon,
      actionText: "Keep phone reachable for counselor call",
      highlight: true,
    },
    {
      step: "Stage 02",
      title: "Physical Verification",
      desc: "Maatram Foundation field volunteers visit the applicant's home location to review original certificates (10th, 11th, 12th, Aadhaar) and understand socio-economic conditions.",
      status: "Upcoming",
      statusColor: "bg-slate-100 text-slate-600 border-slate-200",
      badgeText: "Awaiting Stage 1",
      icon: MapPinIcon,
      actionText: "Original certificates verification at student's home",
      highlight: false,
    },
    {
      step: "Stage 03",
      title: "Video Interview",
      desc: "A one-on-one virtual interaction session with Maatram advisory panel to discuss career aspirations, engineering/arts stream interests, and personal motivation.",
      status: "Upcoming",
      statusColor: "bg-slate-100 text-slate-600 border-slate-200",
      badgeText: "Pending",
      icon: VideoCameraIcon,
      actionText: "Online video meeting link will be shared via SMS/Email",
      highlight: false,
    },
    {
      step: "Stage 04",
      title: "Final Interview",
      desc: "Final selection round with the Board of Trustees and Partner College authorities. Successful candidates are awarded 100% cost-free college seat sponsorship letters.",
      status: "Upcoming",
      statusColor: "bg-slate-100 text-slate-600 border-slate-200",
      badgeText: "Final Stage",
      icon: CheckBadgeIcon,
      actionText: "Official sponsorship letter issued upon selection",
      highlight: false,
    },
  ];

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
                S
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] sm:max-w-[160px] truncate">
                    Student Applicant
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Session" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  MTR-2025-APP4821
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
      <main className="w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6">
        
        {/* Header Overview Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/images/logo.png"
                alt="Maatram Foundation"
                width={140}
                height={70}
                priority
                className="h-12 w-auto object-contain rounded-md shrink-0"
              />
              <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Admission Track 2025 - 2026
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2">
                  Maatram Selection Stages
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Your application has been received. Track the real-time progress of each selection stage below.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-1">
              <span className="text-slate-500">Application Number:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">MTR-2025-APP4821</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Application Received
              </span>
            </div>
          </div>

          {/* Sequential One-By-One Stage Cards */}
          <div className="mt-8 space-y-5">
            {stages.map((item, index) => {
              const ItemIcon = item.icon;
              const isCurrent = item.highlight;

              return (
                <div
                  key={index}
                  className={`relative p-5 sm:p-6 rounded-2xl border transition-all ${
                    isCurrent
                      ? "bg-white border-[#F7BC0F] shadow-md shadow-[#F7BC0F]/10 ring-2 ring-[#F7BC0F]/30"
                      : "bg-slate-50/70 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-4">
                      {/* Step Number & Icon */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isCurrent
                            ? "bg-[#F7BC0F] text-slate-950 border-[#e5ad0c] shadow-sm font-black"
                            : "bg-white text-slate-500 border-slate-200"
                        }`}
                      >
                        <ItemIcon className="w-6 h-6 stroke-[2]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                            {item.step}
                          </span>
                          <h2 className="font-heading font-extrabold text-base sm:text-lg text-slate-900">
                            {item.title}
                          </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                          {item.desc}
                        </p>
                        <div className="mt-2 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F7BC0F]"></span>
                          <span>{item.actionText}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="sm:text-right shrink-0">
                      <span
                        className={`inline-block text-xs font-heading font-bold px-3 py-1 rounded-full border ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                        {item.badgeText}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* ================= SIGN OUT CONFIRMATION MODAL ================= */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false);
          router.push("/");
        }}
      />
    </div>
  );
}
