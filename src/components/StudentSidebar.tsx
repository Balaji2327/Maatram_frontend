"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Squares2X2Icon,
  DocumentCheckIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export type StudentNavTab = "dashboard" | "status" | "profile";

interface StudentSidebarProps {
  activeTab: StudentNavTab;
  onTabChange: (tab: StudentNavTab) => void;
  onSignOutClick: () => void;
  applicationNumber?: string;
  studentName?: string;
  studentPhoto?: string;
}

export default function StudentSidebar({
  activeTab,
  onTabChange,
  onSignOutClick,
  applicationNumber = "MF-2025-001",
  studentName = "Student",
  studentPhoto = "",
}: StudentSidebarProps) {
  const navItems = [
    {
      id: "dashboard" as StudentNavTab,
      label: "DASHBOARD",
      icon: Squares2X2Icon,
      description: "Application Form",
    },
    {
      id: "status" as StudentNavTab,
      label: "STATUS",
      icon: DocumentCheckIcon,
      description: "Application Status",
    },
  ];

  return (
    <aside className="w-[72px] bg-white text-slate-800 shrink-0 flex flex-col justify-between border-r border-slate-200/90 min-h-screen shadow-2xs sticky top-0 h-screen select-none z-30">
      {/* Top Branding Section & Nav */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top App Logo Box */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-center p-2 shrink-0">
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            className="flex items-center justify-center transition-transform hover:scale-105 cursor-pointer focus:outline-none"
            title="Maatram Foundation"
          >
            <Image
              src="/assets/images/logo.png"
              alt="Maatram"
              width={40}
              height={40}
              priority
              className="w-9 h-9 object-contain"
            />
          </button>
        </div>

        {/* Vertical Icon + Subtitle Navigation List */}
        <nav className="py-2 overflow-y-auto flex-1 flex flex-col items-center gap-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            const activeBg = "bg-amber-50/80";
            const activeText = "text-amber-800";
            const activeBar = "bg-[#F7BC0F]";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`group relative w-full flex flex-col items-center justify-center py-2.5 px-1 transition-colors cursor-pointer focus:outline-none ${
                  isActive
                    ? `${activeBg} ${activeText}`
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-50"
                }`}
                title={item.description}
              >
                {/* Active Right Indicator Bar */}
                {isActive && (
                  <span className={`absolute right-0 top-0 bottom-0 w-[3px] ${activeBar} rounded-l`} />
                )}

                {/* Icon */}
                <Icon
                  className={`w-5 h-5 stroke-[1.8] transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? activeText : "text-slate-900"
                  }`}
                />

                {/* All-Caps Label Underneath */}
                <span
                  className={`text-[8px] font-mono font-extrabold tracking-tight mt-1 uppercase text-center leading-tight line-clamp-1 max-w-[68px] ${
                    isActive ? `${activeText} font-black` : "text-slate-800"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile Button (close to Signout) & Sign Out Button */}
      <div className="border-t border-slate-100 flex flex-col items-center py-2 shrink-0 gap-1">
        {/* Profile Nav Item (Close to Sign Out) */}
        <button
          type="button"
          onClick={() => onTabChange("profile")}
          className={`group relative w-full flex flex-col items-center justify-center py-2 px-1 transition-colors cursor-pointer focus:outline-none ${
            activeTab === "profile"
              ? "bg-amber-50/80 text-amber-800"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-50"
          }`}
          title={`Profile - Signed in as ${studentName} (${applicationNumber})`}
        >
          {activeTab === "profile" && (
            <span className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#F7BC0F] rounded-l" />
          )}

          {studentPhoto ? (
            <div className={`w-6 h-6 rounded-full overflow-hidden border transition-transform duration-200 group-hover:scale-110 ${
              activeTab === "profile" ? "border-amber-700 ring-2 ring-[#F7BC0F]/40" : "border-slate-300"
            }`}>
              <img
                src={studentPhoto}
                alt={studentName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <UserCircleIcon
              className={`w-5 h-5 stroke-[1.8] transition-transform duration-200 group-hover:scale-110 ${
                activeTab === "profile" ? "text-amber-800" : "text-slate-900"
              }`}
            />
          )}

          <span
            className={`text-[8px] font-mono font-extrabold tracking-tight mt-1 uppercase text-center leading-tight ${
              activeTab === "profile" ? "text-amber-800 font-black" : "text-slate-800"
            }`}
          >
            PROFILE
          </span>
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onSignOutClick}
          className="group w-full flex flex-col items-center justify-center py-2 px-1 text-slate-500 hover:text-red-600 hover:bg-red-50/60 transition cursor-pointer"
          title="Sign Out"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4 stroke-[2] text-slate-600 group-hover:text-red-600 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-[8px] font-mono font-extrabold tracking-tight mt-1 uppercase text-center text-slate-600 group-hover:text-red-600">
            SIGNOUT
          </span>
        </button>
      </div>
    </aside>
  );
}
