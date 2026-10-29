"use client";

import React from "react";
import Image from "next/image";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";

export interface CollegeCardData {
  id: string;
  name: string;
  imageSrc?: string;
  logoBg?: string;
  logoText?: string;
}

interface CollegeCardProps {
  college: CollegeCardData;
  onClick?: (college: CollegeCardData) => void;
}

export default function CollegeCard({ college, onClick }: CollegeCardProps) {
  return (
    <div
      onClick={() => onClick?.(college)}
      className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-amber-300 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-6 text-center min-h-[290px] sm:min-h-[320px]"
    >
      {/* Circle Shape Image Container */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-amber-50 shadow-md transition-transform duration-300 group-hover:scale-105 shrink-0 flex items-center justify-center bg-slate-100">
        {college.imageSrc ? (
          <Image
            src={college.imageSrc}
            alt={college.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-2"
            style={{ backgroundColor: college.logoBg || "#0F172A" }}
          >
            <BuildingLibraryIcon className="w-10 h-10 text-white/90 stroke-[1.8]" />
            {college.logoText && (
              <span className="font-heading font-extrabold text-[11px] tracking-wider text-white mt-1">
                {college.logoText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* College Name Only */}
      <div className="mt-6 w-full px-2">
        <h3
          className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-3 leading-snug"
          title={college.name}
        >
          {college.name}
        </h3>
      </div>
    </div>
  );
}
