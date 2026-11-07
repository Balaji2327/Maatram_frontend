"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  PencilSquareIcon,
  TrashIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
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
  // Volunteer specific attributes
  mode?: "remote" | "offline";
  studentVolunteersNeeded?: number;
  alumniVolunteersNeeded?: number;
  taskToComplete?: string;
  duration?: string;
  startTime?: string;
  endTime?: string;
  eligibleYears?: string[];
  acceptedStudents?: any[];
  acceptedAlumni?: any[];
  rejectedParticipants?: string[];
  volunteerAssignments?: Record<string, any[]>;
}

interface EventCardProps {
  event: EventCardData;
  onView?: (event: EventCardData) => void;
  onEdit?: (event: EventCardData) => void;
  onDelete?: (event: EventCardData) => void;
  onApproveAssignment?: (eventId: string, volunteerEmail: string) => void;
  onViewAssignments?: (event: EventCardData, volunteer: any) => void;
  isApprovingAssignment?: boolean;
  approvingEmail?: string;
}

export default function EventCard({
  event,
  onView,
  onEdit,
  onDelete,
  onApproveAssignment,
  onViewAssignments,
  isApprovingAssignment = false,
  approvingEmail = "",
}: EventCardProps) {
  const [isAcceptedModalOpen, setIsAcceptedModalOpen] = useState(false);

  const isRemote = event.mode === "remote";
  const sAccepted = event.acceptedStudents?.length || 0;
  const sNeeded = event.studentVolunteersNeeded || 0;
  const aAccepted = event.acceptedAlumni?.length || 0;
  const aNeeded = event.alumniVolunteersNeeded || 0;
  const allAccepted = [
    ...(event.acceptedStudents || []).map((s: any) => ({ ...s, volunteerRole: "Student" })),
    ...(event.acceptedAlumni || []).map((a: any) => ({ ...a, volunteerRole: "Alumni" })),
  ];
  const totalAccepted = allAccepted.length;

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
              <span className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs backdrop-blur-xs flex items-center gap-1.5 ${
                isRemote ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
              }`}>
                {isRemote ? (
                  <>
                    <GlobeAltIcon className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                    <span>Remote</span>
                  </>
                ) : (
                  <>
                    <MapPinIcon className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                    <span>Offline</span>
                  </>
                )}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              {totalAccepted > 0 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAcceptedModalOpen(true);
                  }}
                  title="Click to view accepted volunteers list"
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs bg-emerald-600/95 hover:bg-emerald-700 text-white border-emerald-500 flex items-center gap-1 cursor-pointer transition transform hover:scale-105"
                >
                  <CheckCircleIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{totalAccepted} Accepted {totalAccepted === 1 ? "Volunteer" : "Volunteers"}</span>
                </button>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs bg-slate-900/80 text-white border-slate-700">
                  Waiting for Volunteers
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 pb-0 flex items-center justify-between">
            <span className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
              isRemote ? "bg-blue-50 text-blue-800 border-blue-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}>
              {isRemote ? (
                <>
                  <GlobeAltIcon className="w-3.5 h-3.5 text-blue-600 stroke-[2.2] shrink-0" />
                  <span>Remote</span>
                </>
              ) : (
                <>
                  <MapPinIcon className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2] shrink-0" />
                  <span>Offline</span>
                </>
              )}
            </span>
            {totalAccepted > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAcceptedModalOpen(true);
                }}
                title="Click to view accepted volunteers list"
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center gap-1 cursor-pointer transition transform hover:scale-105"
              >
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>{totalAccepted} Accepted {totalAccepted === 1 ? "Volunteer" : "Volunteers"}</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                0 Accepted Volunteers
              </span>
            )}
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

          {/* Volunteer Task Snippet */}
          {event.taskToComplete && (
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2">
              <ClipboardDocumentCheckIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-bold">Task: </span>
                <span className="line-clamp-1">{event.taskToComplete}</span>
              </div>
            </div>
          )}

          {/* Key Event Details Grid */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
            {/* Remote Duration or Offline Date/Time */}
            {isRemote ? (
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#F7BC0F] shrink-0 stroke-[2]" />
                <span className="font-medium text-slate-800">Duration: {event.duration || "Self-paced"}</span>
              </div>
            ) : (
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
            )}

            {/* Location (for Offline) */}
            {!isRemote && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-[#F7BC0F] shrink-0 stroke-[2]" />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {/* Volunteer Quotas (Separate student and alumni counts) */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Students</span>
                <span className="font-extrabold text-slate-900 font-heading">
                  {sAccepted} / {sNeeded} <span className="font-normal text-slate-500">spots</span>
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Alumni</span>
                <span className="font-extrabold text-slate-900 font-heading">
                  {aAccepted} / {aNeeded} <span className="font-normal text-slate-500">spots</span>
                </span>
              </div>
            </div>

            {/* Eligible Years */}
            {event.eligibleYears && event.eligibleYears.length > 0 && (
              <div className="text-[11px] text-slate-500 pt-1">
                <span className="font-bold text-slate-700">Eligible: </span>
                {event.eligibleYears.map((yr) => `Year ${yr}`).join(", ")}
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
      {/* Accepted Volunteers Popup Modal */}
      {isAcceptedModalOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsAcceptedModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300">
                  <CheckCircleIcon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Accepted Volunteers ({totalAccepted})
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-sm">
                    {event.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAcceptedModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Quota Progress Summary */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="block text-[10px] font-bold uppercase text-slate-500">Student Spots</span>
                <span className="font-heading font-extrabold text-slate-900 text-sm mt-0.5 block">
                  {sAccepted} / {sNeeded} <span className="font-normal text-xs text-slate-500">accepted</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="block text-[10px] font-bold uppercase text-slate-500">Alumni Spots</span>
                <span className="font-heading font-extrabold text-slate-900 text-sm mt-0.5 block">
                  {aAccepted} / {aNeeded} <span className="font-normal text-xs text-slate-500">accepted</span>
                </span>
              </div>
            </div>

            {/* Accepted Volunteers List */}
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {allAccepted.map((vol: any, idx: number) => (
                <div
                  key={vol.email || idx}
                  className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 truncate mr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{vol.name || "Volunteer"}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                        Confirmed
                      </span>
                    </div>

                    <a
                      href={`mailto:${vol.email}`}
                      className="text-slate-600 hover:text-amber-600 flex items-center gap-1 font-mono text-[11px] truncate"
                    >
                      <EnvelopeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{vol.email}</span>
                    </a>

                    {(vol.college || vol.company) && (
                      <p className="text-[11px] text-slate-500 truncate">
                        {vol.college || vol.company} {vol.year_of_study ? `(${vol.year_of_study})` : ""}
                      </p>
                    )}

                    {vol.accepted_at && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        Accepted on: {new Date(vol.accepted_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-xl text-[10px] font-heading font-bold uppercase tracking-wider ${
                        vol.volunteerRole === "Alumni"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {vol.volunteerRole}
                    </span>

                    {/* Admin Approval & AI Batch Assignment Controls */}
                    {vol.assignment_approved ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <CheckCircleIcon className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                          <span>Approved ({vol.assigned_count ?? 10} assigned)</span>
                        </span>
                        {onViewAssignments && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewAssignments(event, vol);
                            }}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition cursor-pointer"
                          >
                            View List
                          </button>
                        )}
                      </div>
                    ) : onApproveAssignment ? (
                      <button
                        type="button"
                        disabled={isApprovingAssignment && approvingEmail === vol.email}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApproveAssignment(event.id, vol.email);
                        }}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-900 bg-[#F7BC0F] hover:bg-[#e5ad0c] border border-amber-500 shadow-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircleIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                        <span>
                          {isApprovingAssignment && approvingEmail === vol.email
                            ? "AI Matching..."
                            : "Approve & Assign (10)"}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                        Pending Admin Approval
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsAcceptedModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
