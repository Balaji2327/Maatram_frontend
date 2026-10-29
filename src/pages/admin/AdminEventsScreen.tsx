"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { getAdminToken } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";
import EventCard, { EventCardData } from "../../components/EventCard";

export default function AdminEventsScreen() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Events list state
  const [eventsList, setEventsList] = useState<EventCardData[]>([
    {
      id: "ev-1",
      title: "Maatram Annual Scholars Orientation 2026",
      description: "Welcome gathering, mentor introductions, laptop distribution guidelines, and academic roadmap for newly selected scholarship recipients.",
      date: "Nov 15, 2026",
      time: "09:30 AM - 01:30 PM",
      location: "Kamaraj Arangam, Chennai",
      category: "Orientation",
      targetAudience: "New 1st Year Scholars & Parents",
      imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
      status: "upcoming",
    },
    {
      id: "ev-2",
      title: "Full-Stack Web Development Bootcamp",
      description: "Hands-on engineering workshop on Next.js, Node.js, and cloud deployments led by senior alumni software engineers.",
      date: "Nov 22, 2026",
      time: "10:00 AM - 04:00 PM",
      location: "Virtual (Google Meet)",
      category: "Workshop",
      targetAudience: "2nd & 3rd Year Engineering Scholars",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      status: "upcoming",
    },
    {
      id: "ev-3",
      title: "Maatram Alumni Annual Meet 2026",
      description: "Reconnecting graduates from across Tamil Nadu to celebrate career milestones and expand foundation mentoring networks.",
      date: "Dec 05, 2026",
      time: "04:00 PM - 08:30 PM",
      location: "PSG Tech Convention Hall, Coimbatore",
      category: "Alumni Meet",
      targetAudience: "All Maatram Alumni & Final Years",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      status: "upcoming",
    },
    {
      id: "ev-4",
      title: "Mock Interview & Aptitude Masterclass",
      description: "One-on-one resume reviews, HR mock interview panels, and company placement preparation drills by corporate volunteers.",
      date: "Dec 18, 2026",
      time: "09:00 AM - 01:00 PM",
      location: "Anna University Campus, Chennai",
      category: "Career Prep",
      targetAudience: "Final Year Graduating Scholars",
      imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
      status: "upcoming",
    },
  ]);

  // Create / Edit Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form Fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("Workshop");
  const [eventTargetAudience, setEventTargetAudience] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [eventStatus, setEventStatus] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [formError, setFormError] = useState("");

  // Detail View Modal State
  const [selectedEvent, setSelectedEvent] = useState<EventCardData | null>(null);

  // Handle local image file upload + preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventCategory("Workshop");
    setEventTargetAudience("");
    setEventImageUrl("");
    setImageFileName("");
    setEventStatus("upcoming");
    setFormError("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsEventModalOpen(true);
  };

  const openEditModal = (event: EventCardData) => {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventDate(event.date);
    setEventTime(event.time || "");
    setEventLocation(event.location);
    setEventCategory(event.category || "Workshop");
    setEventTargetAudience(event.targetAudience || "");
    setEventImageUrl(event.imageUrl || "");
    setImageFileName(event.imageUrl ? "Existing Image" : "");
    setEventStatus(event.status || "upcoming");
    setFormError("");
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      setFormError("Event title is required");
      return;
    }
    if (!eventDate.trim()) {
      setFormError("Event date is required");
      return;
    }
    if (!eventLocation.trim()) {
      setFormError("Event location or meeting link is required");
      return;
    }

    if (editingEventId) {
      // Update existing event
      setEventsList((prev) =>
        prev.map((ev) =>
          ev.id === editingEventId
            ? {
              ...ev,
              title: eventTitle.trim(),
              description: eventDescription.trim(),
              date: eventDate.trim(),
              time: eventTime.trim(),
              location: eventLocation.trim(),
              category: eventCategory,
              targetAudience: eventTargetAudience.trim(),
              imageUrl: eventImageUrl,
              status: eventStatus,
            }
            : ev
        )
      );
    } else {
      // Create new event
      const newEvent: EventCardData = {
        id: `ev-${Date.now()}`,
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        date: eventDate.trim(),
        time: eventTime.trim(),
        location: eventLocation.trim(),
        category: eventCategory,
        targetAudience: eventTargetAudience.trim(),
        imageUrl: eventImageUrl,
        status: eventStatus,
      };
      setEventsList((prev) => [newEvent, ...prev]);
    }

    setIsEventModalOpen(false);
    resetForm();
  };

  const handleDeleteEvent = (event: EventCardData) => {
    if (confirm(`Are you sure you want to delete event "${event.title}"?`)) {
      setEventsList((prev) => prev.filter((ev) => ev.id !== event.id));
      if (selectedEvent?.id === event.id) {
        setSelectedEvent(null);
      }
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((ev) => {
      const matchSearch =
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === "All" || ev.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [eventsList, searchTerm, selectedCategory]);

  const categories = ["All", "Workshop", "Orientation", "Alumni Meet", "Career Prep", "Ceremony"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary flex">
      {/* 1. Yellow & White Sidebar */}
      <AdminSidebar
        activeTab="events"
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="w-full px-6 lg:px-10 py-8 space-y-8 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                Events
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Schedule workshops, alumni meetups, scholar orientations, and ceremonies.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] transition cursor-pointer shadow-xs border border-[#e5ad0c]"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by title or venue..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition shrink-0 ${selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#F7BC0F] text-slate-950 font-bold border border-[#e5ad0c]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid (Clean 3-Column / Responsive Layout) */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3 shadow-2xs">
              <CalendarDaysIcon className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-heading font-bold text-slate-800">No Events Found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No events match your search or filter criteria. Click "Create Event" above to publish a new one.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] transition border border-[#e5ad0c]"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Create First Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onView={(ev) => setSelectedEvent(ev)}
                  onEdit={(ev) => openEditModal(ev)}
                  onDelete={(ev) => handleDeleteEvent(ev)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT EVENT POPUP MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <CalendarDaysIcon className="w-4 h-4 text-[#F7BC0F] stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {editingEventId ? "Edit Event" : "Create New Event"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Fill in the details to publish to the scholars and alumni portal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Scholars Orientation 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Orientation">Orientation</option>
                    <option value="Alumni Meet">Alumni Meet</option>
                    <option value="Career Prep">Career Prep</option>
                    <option value="Ceremony">Ceremony</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={eventStatus}
                    onChange={(e) => setEventStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. Nov 15, 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 01:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                  />
                </div>
              </div>

              {/* Location & Target Audience */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                    Location / Venue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Kamaraj Arangam or Virtual (Meet)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={eventTargetAudience}
                    onChange={(e) => setEventTargetAudience(e.target.value)}
                    placeholder="e.g. 1st Year Scholars / Alumni"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Event Description
                </label>
                <textarea
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Outline the agenda, speaker names, and participation guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F]"
                />
              </div>

              {/* Image Upload (Optional) */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Banner Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition">
                    <ArrowUpTrayIcon className="w-4 h-4 stroke-[2]" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {imageFileName && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <PhotoIcon className="w-4 h-4 text-[#F7BC0F]" />
                      <span className="truncate max-w-[200px]">{imageFileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEventImageUrl("");
                          setImageFileName("");
                        }}
                        className="text-slate-400 hover:text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {eventImageUrl && (
                  <div className="relative w-full h-32 mt-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <Image
                      src={eventImageUrl}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c]"
                >
                  {editingEventId ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL VIEW POPUP MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {selectedEvent.imageUrl && (
              <div className="relative w-full h-52 bg-slate-100">
                <Image
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 flex items-center justify-center backdrop-blur-xs transition"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedEvent.category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  {selectedEvent.status || "Upcoming"}
                </span>
              </div>

              <h2 className="font-heading font-bold text-xl text-slate-900">
                {selectedEvent.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed font-primary">
                {selectedEvent.description}
              </p>

              {/* Metadata List */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CalendarDaysIcon className="w-4 h-4 text-[#F7BC0F] stroke-[2]" />
                  <span className="font-bold">{selectedEvent.date}</span>
                  {selectedEvent.time && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{selectedEvent.time}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPinIcon className="w-4 h-4 text-[#F7BC0F] stroke-[2]" />
                  <span>{selectedEvent.location}</span>
                </div>

                {selectedEvent.targetAudience && (
                  <div className="flex items-center gap-2.5">
                    <UserGroupIcon className="w-4 h-4 text-slate-400 stroke-[2]" />
                    <span className="text-slate-500">
                      Audience: <strong className="text-slate-700">{selectedEvent.targetAudience}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const ev = selectedEvent;
                      setSelectedEvent(null);
                      openEditModal(ev);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    Edit Event
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-1.5 text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => router.push("/")}
      />
    </div>
  );
}
