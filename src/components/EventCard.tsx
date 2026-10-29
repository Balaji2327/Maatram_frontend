"use client";

import React from "react";
import Image from "next/image";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export interface EventCardData {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  category: string;
  targetAudience?: string;
  imageUrl?: string;
  status?: "upcoming" | "completed" | "cancelled";
}

interface EventCardProps {
  event: EventCardData;
  onView?: (event: EventCardData) => void;
  onEdit?: (event: EventCardData) => void;
  onDelete?: (event: EventCardData) => void;
}

export default function EventCard({
  event,
  onView,
  onEdit,
  onDelete,
}: EventCardProps) {
  const isUpcoming = event.status !== "completed" && event.status !== "cancelled";

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#F7BC0F] transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div onClick={() => onView?.(event)} className="cursor-pointer">
        {/* Optional Event Image */}
        {event.imageUrl ? (
          <div className="relative w-full h-44 bg-slate-100 overflow-hidden shrink-0">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-slate-800 shadow-2xs border border-slate-200/60 backdrop-blur-xs">
                {event.category}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs ${
                  event.status === "completed"
                    ? "bg-slate-900/90 text-white border-slate-800"
                    : event.status === "cancelled"
                    ? "bg-red-500/90 text-white border-red-600"
                    : "bg-[#F7BC0F] text-slate-950 border-[#e5ad0c]"
                }`}
              >
                {event.status || "Upcoming"}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5 pb-0 flex items-center justify-between">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {event.category}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                event.status === "completed"
                  ? "bg-slate-100 text-slate-600 border-slate-200"
                  : event.status === "cancelled"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              {event.status || "Upcoming"}
            </span>
          </div>
        )}

        {/* Content Details */}
        <div className="p-5 space-y-3">
          <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-amber-900 transition line-clamp-1">
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 font-primary line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Key Event Details Grid */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
            {/* Date & Time */}
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4 text-[#F7BC0F] shrink-0 stroke-[2]" />
              <span className="font-medium text-slate-800">{event.date}</span>
              {event.time && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 text-slate-600">
                    <ClockIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                </>
              )}
            </div>

            {/* Location / Venue */}
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-[#F7BC0F] shrink-0 stroke-[2]" />
              <span className="truncate">{event.location}</span>
            </div>

            {/* Target Audience */}
            {event.targetAudience && (
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-4 h-4 text-slate-400 shrink-0 stroke-[2]" />
                <span className="text-slate-500 truncate">{event.targetAudience}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Admin Actions */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onView?.(event)}
          className="text-xs font-heading font-bold text-slate-700 hover:text-slate-950 transition cursor-pointer"
        >
          View Details &rarr;
        </button>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              title="Edit event"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event);
              }}
              title="Delete event"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
