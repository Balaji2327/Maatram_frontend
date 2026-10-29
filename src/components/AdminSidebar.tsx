"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  BuildingLibraryIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import AskMarkBot from "./AskMarkBot";

export type AdminTab =
  | "dashboard"
  | "applications"
  | "volunteers"
  | "alumni"
  | "students"
  | "events"
  | "posts"
  | "colleges"
  | "settings";

interface AdminSidebarProps {
  activeTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  applicationsCount?: number;
  reviewedCount?: number;
  pendingCount?: number;
  onSignOutClick: () => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  applicationsCount = 0,
  onSignOutClick,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Auto-detect active tab from current URL pathname
  const currentTab: AdminTab = activeTab || (
    pathname?.includes("/admin/settings")
      ? "settings"
      : pathname?.includes("/admin/volunteers")
      ? "volunteers"
      : pathname?.includes("/admin/applications")
      ? "applications"
      : pathname?.includes("/admin/alumni")
      ? "alumni"
      : pathname?.includes("/admin/students")
      ? "students"
      : pathname?.includes("/admin/events")
      ? "events"
      : pathname?.includes("/admin/posts")
      ? "posts"
      : pathname?.includes("/admin/colleges")
      ? "colleges"
      : "dashboard"
  );

  const mainNavItems = [
    {
      id: "dashboard" as AdminTab,
      label: "DASHBOARD",
      href: "/admin/dashboard",
      icon: Squares2X2Icon,
    },
    {
      id: "applications" as AdminTab,
      label: "APPLICATIONS",
      href: "/admin/applications",
      icon: DocumentTextIcon,
    },
    {
      id: "volunteers" as AdminTab,
      label: "VOLUNTEERS",
      href: "/admin/volunteers",
      icon: UserGroupIcon,
    },
    {
      id: "alumni" as AdminTab,
      label: "ALUMNI",
      href: "/admin/alumni",
      icon: AcademicCapIcon,
    },
    {
      id: "students" as AdminTab,
      label: "STUDENTS",
      href: "/admin/students",
      icon: UsersIcon,
    },
    {
      id: "events" as AdminTab,
      label: "EVENTS",
      href: "/admin/events",
      icon: CalendarDaysIcon,
    },
    {
      id: "posts" as AdminTab,
      label: "POSTS",
      href: "/admin/posts",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      id: "colleges" as AdminTab,
      label: "COLLEGES",
      href: "/admin/colleges",
      icon: BuildingLibraryIcon,
    },
  ];

  return (
    <aside className="w-[72px] bg-white text-slate-800 shrink-0 flex flex-col justify-between border-r border-slate-200/90 min-h-screen shadow-2xs sticky top-0 h-screen select-none">
      {/* Top Branding Section & Nav */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top App Logo Box */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-center p-2 shrink-0">
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
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
          </Link>
        </div>

        {/* Vertical Icon + Subtitle Navigation List */}
        <nav className="py-1.5 overflow-y-auto flex-1 flex flex-col items-center gap-0.5 scrollbar-none">
          {mainNavItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            // Active state uses Yellow theme (#F7BC0F)
            const activeBg = "bg-amber-50/80";
            const activeText = "text-amber-800";
            const activeBar = "bg-[#F7BC0F]";

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onTabChange?.(item.id)}
                className={`group relative w-full flex flex-col items-center justify-center py-2 px-1 transition-colors cursor-pointer ${
                  isActive
                    ? `${activeBg} ${activeText}`
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-50"
                }`}
                title={item.label}
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
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section (Settings & Sign Out) */}
      <div className="border-t border-slate-100 flex flex-col items-center py-1.5 shrink-0">
        {/* Settings Tab (uses Yellow theme) */}
        <Link
          href="/admin/settings"
          onClick={() => onTabChange?.("settings")}
          className={`group relative w-full flex flex-col items-center justify-center py-2 px-1 transition-colors cursor-pointer ${
            currentTab === "settings"
              ? "bg-amber-50/80 text-amber-800"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-50"
          }`}
          title="Settings"
        >
          {currentTab === "settings" && (
            <span className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#F7BC0F] rounded-l" />
          )}
          <Cog6ToothIcon
            className={`w-5 h-5 stroke-[1.8] transition-transform duration-200 group-hover:scale-110 ${
              currentTab === "settings" ? "text-amber-800" : "text-slate-900"
            }`}
          />
          <span
            className={`text-[8px] font-mono font-extrabold tracking-tight mt-1 uppercase text-center leading-tight ${
              currentTab === "settings" ? "text-amber-800 font-black" : "text-slate-800"
            }`}
          >
            SETTINGS
          </span>
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onSignOutClick}
          className="group w-full flex flex-col items-center justify-center py-2 px-1 text-slate-500 hover:text-red-600 hover:bg-red-50/60 transition cursor-pointer mt-0.5"
          title="Sign Out"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4 stroke-[2] text-slate-600 group-hover:text-red-600 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-[8px] font-mono font-extrabold tracking-tight mt-1 uppercase text-center text-slate-600 group-hover:text-red-600">
            LOGOUT
          </span>
        </button>
      </div>

      {/* Floating Ask Mark AI Bot accessible across all admin pages */}
      <AskMarkBot applicationsCount={applicationsCount} />
    </aside>
  );
}
