"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import { getAdminToken, adminApi } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import PostCard, { PostCardData } from "../../components/PostCard";

// In-memory cache for instant zero-latency page transitions
let cachedPostsList: PostCardData[] | null = null;

export default function AdminPostsScreen() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Start with false if cache exists so cards show instantly with zero delay or skeleton
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [showSlowNetworkIndicator, setShowSlowNetworkIndicator] = useState(false);

  // Create Post Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Announcement");
  const [postScheduleDate, setPostScheduleDate] = useState("");
  const [postScheduleTime, setPostScheduleTime] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [postLanguage, setPostLanguage] = useState("English");
  const [postAuthor, setPostAuthor] = useState("Admin Office");

  // Video State
  const [postVideoUrl, setPostVideoUrl] = useState("");
  const [videoFileName, setVideoFileName] = useState("");

  // Multiple Images State
  const [postImages, setPostImages] = useState<string[]>([]);
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Video File Upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("Video size should be less than 50MB");
        return;
      }
      setVideoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVideo = () => {
    setPostVideoUrl("");
    setVideoFileName("");
  };

  // Handle Multiple Images File Upload
  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 10MB`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImages((prev) => [...prev, reader.result as string]);
        setImageFileNames((prev) => [...prev, file.name]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSingleImage = (indexToRemove: number) => {
    setPostImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImageFileNames((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Editing post state (null = creating new post, string = editing existing post ID)
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Selected post view modal
  const [selectedPost, setSelectedPost] = useState<PostCardData | null>(null);

  // Delete Confirmation Modal State
  const [postToDelete, setPostToDelete] = useState<PostCardData | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  // Community Posts state initialized directly from instant memory cache
  const [postsList, setPostsList] = useState<PostCardData[]>(() => cachedPostsList || []);

  // Fetch all posts from database via backend API
  const fetchPosts = async () => {
    // Only show a loading spinner if network takes longer than 1.5 seconds and there are no cached posts
    let slowTimer: NodeJS.Timeout | null = null;
    if (!cachedPostsList || cachedPostsList.length === 0) {
      slowTimer = setTimeout(() => {
        setShowSlowNetworkIndicator(true);
      }, 1500);
    }

    try {
      const res = await adminApi.getPosts();
      if (res.success && Array.isArray(res.data)) {
        const formatted: PostCardData[] = res.data.map((item: any) => {
          const imagesList = Array.isArray(item.images) ? item.images : [];
          const primaryImage = item.image_url || (imagesList.length > 0 ? imagesList[0] : undefined);

          return {
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category,
            scheduleDate: item.schedule_date,
            scheduleTime: item.schedule_time,
            location: item.location,
            language: item.language,
            authorName: item.author_name,
            imageUrl: primaryImage,
            images: imagesList,
            videoUrl: item.video_url,
            videoFileName: item.video_file_name,
            createdAt: item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent",
          };
        });
        cachedPostsList = formatted;
        setPostsList(formatted);
      }
    } catch (err) {
      console.error("Failed to load posts from database:", err);
    } finally {
      if (slowTimer) clearTimeout(slowTimer);
      setShowSlowNetworkIndicator(false);
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    } else {
      fetchPosts();
    }
  }, [router]);

  // Open Edit Modal
  const handleEditClick = (post: PostCardData) => {
    setEditingPostId(post.id);
    setPostTitle(post.title || "");
    setPostContent(post.content || "");
    setPostCategory(post.category || "Announcement");
    setPostScheduleDate(post.scheduleDate || "");
    setPostScheduleTime(post.scheduleTime || "");
    setPostLocation(post.location || "");
    setPostLanguage(post.language || "English");
    setPostAuthor(post.authorName || "Admin Office");

    // Video
    setPostVideoUrl(post.videoUrl || "");
    setVideoFileName(post.videoFileName || (post.videoUrl ? "Attached Video" : ""));

    // Multiple Images
    if (post.images && post.images.length > 0) {
      setPostImages(post.images);
      setImageFileNames(post.images.map((_, i) => `Image ${i + 1}`));
    } else if (post.imageUrl) {
      setPostImages([post.imageUrl]);
      setImageFileNames(["Cover Image"]);
    } else {
      setPostImages([]);
      setImageFileNames([]);
    }

    setIsCreateModalOpen(true);
  };

  // Delete Post with confirmation and database sync
  // Trigger Delete Confirmation Modal
  const handleDeleteClick = (post: PostCardData) => {
    setPostToDelete(post);
  };

  // Perform post deletion after user confirms in the modal
  const handleConfirmDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeletingPost(true);
    try {
      await adminApi.deletePost(postToDelete.id);
      setPostsList((prev) => {
        const updated = prev.filter((p) => p.id !== postToDelete.id);
        cachedPostsList = updated;
        return updated;
      });
      if (selectedPost?.id === postToDelete.id) {
        setSelectedPost(null);
      }
      setPostToDelete(null);
    } catch (err: any) {
      alert("Failed to delete post: " + (err.message || "Server error"));
    } finally {
      setIsDeletingPost(false);
    }
  };

  // Search filter
  const filteredPosts = useMemo(() => {
    return postsList.filter((post) => {
      const q = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        (post.category && post.category.toLowerCase().includes(q)) ||
        (post.location && post.location.toLowerCase().includes(q)) ||
        (post.language && post.language.toLowerCase().includes(q)) ||
        (post.authorName && post.authorName.toLowerCase().includes(q))
      );
    });
  }, [postsList, searchTerm]);

  const resetForm = () => {
    setPostTitle("");
    setPostContent("");
    setPostCategory("Announcement");
    setPostScheduleDate("");
    setPostScheduleTime("");
    setPostLocation("");
    setPostLanguage("English");
    setPostAuthor("Admin Office");
    setPostVideoUrl("");
    setVideoFileName("");
    setPostImages([]);
    setImageFileNames([]);
    setEditingPostId(null);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert("Please provide both a post title and description/content.");
      return;
    }

    setIsSubmitting(true);

    try {
      const primaryImageUrl = postImages.length > 0 ? postImages[0] : undefined;

      const payload = {
        title: postTitle.trim(),
        content: postContent.trim(),
        category: postCategory.trim(),
        scheduleDate: postScheduleDate || undefined,
        scheduleTime: postScheduleTime || undefined,
        location: postLocation.trim() || undefined,
        language: postLanguage.trim() || "English",
        authorName: postAuthor.trim() || "Foundation Admin",
        videoUrl: postVideoUrl || undefined,
        videoFileName: videoFileName || undefined,
        images: postImages.length > 0 ? postImages : undefined,
        imageUrl: primaryImageUrl,
      };

      if (editingPostId) {
        // Edit existing post in database
        const res = await adminApi.updatePost(editingPostId, payload);
        if (res.success) {
          await fetchPosts();
        } else {
          alert(res.message || "Failed to update post in database");
          setIsSubmitting(false);
          return;
        }
      } else {
        // Create new post in database
        const res = await adminApi.createPost(payload);
        if (res.success) {
          await fetchPosts();
        } else {
          alert(res.message || "Failed to save post to database");
          setIsSubmitting(false);
          return;
        }
      }

      setIsCreateModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert("Error saving post to database: " + (err.message || "Server error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-primary flex">
      {/* 1. Yellow & White Sidebar */}
      <AdminSidebar
        activeTab="posts"
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="w-full px-6 lg:px-10 py-8 space-y-8 flex-1">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Community Posts
              </h1>
              <p className="font-primary text-xs sm:text-sm text-slate-600 mt-1">
                Publish foundation announcements, stories, news, and community discussions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] transition cursor-pointer shadow-xs border border-[#e5ad0c]"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Search & Counter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts by title, author, or content..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Slow network indicator banner only if network takes more than 1.5s on initial empty fetch */}
          {showSlowNetworkIndicator && (
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center justify-center gap-2 text-xs text-amber-900 animate-in fade-in">
              <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span>Fetching latest updates from server...</span>
            </div>
          )}

          {/* Posts Grid Layout - Instant rendering */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 shadow-xs">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
              <p className="text-base font-bold text-slate-700">No Posts Published Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Keep alumni, scholars, and volunteers informed. Click "Create Post" to publish your first announcement.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] transition cursor-pointer shadow-xs border border-[#e5ad0c]"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Create Post</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onReadMore={(p) => setSelectedPost(p)}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT POST MODAL POPUP */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {editingPostId ? "Edit Post" : "Create New Post"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Publish updates, schedules, and media to students and alumni
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePost} className="space-y-4">
              {/* 1. Post Title */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Annual Scholarship Orientation Day 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              {/* 2. Post Description / Content */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Post Description / Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write full details of the announcement, event instructions, rules, or message..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              {/* 3 & 4. Category (Dropdown) & Post Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                    Category (Dropdown) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Orientation">Orientation</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Alumni Story">Alumni Story</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Placement & Careers">Placement & Careers</option>
                    <option value="Celebration">Celebration</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                    Post Language
                  </label>
                  <select
                    value={postLanguage}
                    onChange={(e) => setPostLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Bilingual">Bilingual (English & Tamil)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                  </select>
                </div>
              </div>

              {/* 5, 6, 7. Schedule Date, Schedule Time, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                    Schedule Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={postScheduleDate}
                      onChange={(e) => setPostScheduleDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                    Schedule Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={postScheduleTime}
                      onChange={(e) => setPostScheduleTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={postLocation}
                      onChange={(e) => setPostLocation(e.target.value)}
                      placeholder="e.g. Chennai / Virtual Meet"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                    />
                  </div>
                </div>
              </div>

              {/* 8. Upload Video */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Upload Video <span className="text-slate-400 font-normal">(MP4, WebM up to 50MB)</span>
                </label>

                {!postVideoUrl ? (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-[#F7BC0F] rounded-2xl bg-slate-50 hover:bg-amber-50/20 transition cursor-pointer group">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-amber-800 group-hover:scale-105 transition shadow-2xs mb-1.5">
                      <VideoCameraIcon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <p className="text-xs font-heading font-bold text-slate-700">
                      Click to upload video
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports MP4, MOV, WebM formats
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-2xl border border-purple-200 bg-purple-50/40 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                        <VideoCameraIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-heading font-bold text-slate-800 truncate">
                          {videoFileName || "Selected Video"}
                        </p>
                        <p className="text-[10px] text-purple-700 font-semibold mt-0.5">
                          Video ready to attach
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Remove Video"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 9. Upload Images (Multiple) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-heading font-bold text-slate-700">
                    Upload Images (Multiple) <span className="text-slate-400 font-normal">(PNG, JPG, WEBP up to 10MB each)</span>
                  </label>
                  {postImages.length > 0 && (
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {postImages.length} {postImages.length === 1 ? "Image" : "Images"} selected
                    </span>
                  )}
                </div>

                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-[#F7BC0F] rounded-2xl bg-slate-50 hover:bg-amber-50/20 transition cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-amber-800 group-hover:scale-105 transition shadow-2xs mb-1.5">
                    <PhotoIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <p className="text-xs font-heading font-bold text-slate-700">
                    Click to add one or more images
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hold Ctrl / Cmd or select multiple pictures
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleImagesChange}
                    className="hidden"
                  />
                </label>

                {/* Previews of uploaded images */}
                {postImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-3">
                    {postImages.map((imgSrc, index) => (
                      <div
                        key={index}
                        className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs"
                      >
                        <img
                          src={imgSrc}
                          alt={`Uploaded preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSingleImage(index)}
                            className="p-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer shadow-xs"
                            title="Delete this image"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded shadow-xs">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c]"
                >
                  {isSubmitting
                    ? editingPostId
                      ? "Saving..."
                      : "Publishing..."
                    : editingPostId
                    ? "Update Post"
                    : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW POST DETAILS MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-heading font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {selectedPost.category || "Post"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Category & Language Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-heading font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {selectedPost.category || "Post"}
              </span>
              {selectedPost.language && (
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                  <LanguageIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{selectedPost.language}</span>
                </span>
              )}
            </div>

            {/* Video Player if uploaded */}
            {selectedPost.videoUrl && (
              <div className="w-full rounded-2xl overflow-hidden bg-black/90 border border-slate-200 shadow-xs">
                <video
                  src={selectedPost.videoUrl}
                  controls
                  className="w-full max-h-64 object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Multiple Images Gallery / Primary Image */}
            {selectedPost.images && selectedPost.images.length > 0 ? (
              <div className="space-y-2">
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={selectedPost.images[0]}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedPost.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedPost.images.slice(1).map((img, i) => (
                      <div key={i} className="relative h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedPost.imageUrl ? (
              <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <h2 className="font-heading font-bold text-xl text-slate-900 leading-snug">
              {selectedPost.title}
            </h2>

            {/* Schedule, Location & Author Meta */}
            <div className="space-y-2 pb-3 border-b border-slate-100 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-3">
                {selectedPost.scheduleDate && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{selectedPost.scheduleDate} {selectedPost.scheduleTime ? `@ ${selectedPost.scheduleTime}` : ""}</span>
                  </span>
                )}
                {selectedPost.location && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <MapPinIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{selectedPost.location}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>By {selectedPost.authorName || "Foundation Admin"}</span>
                <span>•</span>
                <span>Created {selectedPost.createdAt}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedPost.content}
            </p>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 text-xs font-heading font-bold text-slate-950 bg-[#F7BC0F] hover:bg-[#e5ad0c] rounded-xl transition cursor-pointer shadow-xs border border-[#e5ad0c]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleConfirmDeletePost}
        title="Delete Community Post"
        itemName={postToDelete?.title}
        description="Are you sure you want to delete this post? It will be permanently removed from the database and all images/videos will be deleted from your AWS S3 bucket."
        confirmButtonText="Delete Post"
        isDeleting={isDeletingPost}
      />

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => router.push("/")}
      />
    </div>
  );
}
