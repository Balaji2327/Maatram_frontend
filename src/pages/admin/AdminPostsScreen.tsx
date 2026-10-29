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
} from "@heroicons/react/24/outline";
import { getAdminToken } from "../../lib/api";
import AdminSidebar from "../../components/AdminSidebar";
import SignOutModal from "../../components/SignOutModal";
import PostCard, { PostCardData } from "../../components/PostCard";

export default function AdminPostsScreen() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Post Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Announcement");
  const [postAuthor, setPostAuthor] = useState("Admin Office");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setPostImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPostImageUrl("");
    setImageFileName("");
  };

  // Editing post state (null = creating new post, string = editing existing post ID)
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Selected post view modal
  const [selectedPost, setSelectedPost] = useState<PostCardData | null>(null);

  // Community Posts state (starts clean / no dummy data, or initial announcement)
  const [postsList, setPostsList] = useState<PostCardData[]>([]);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Open Edit Modal
  const handleEditClick = (post: PostCardData) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostCategory(post.category || "Announcement");
    setPostAuthor(post.authorName || "Admin Office");
    setPostImageUrl(post.imageUrl || "");
    setImageFileName(post.imageUrl ? "Existing Image" : "");
    setIsCreateModalOpen(true);
  };

  // Delete Post with confirmation
  const handleDeleteClick = (post: PostCardData) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setPostsList((prev) => prev.filter((p) => p.id !== post.id));
      if (selectedPost?.id === post.id) {
        setSelectedPost(null);
      }
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
        (post.authorName && post.authorName.toLowerCase().includes(q))
      );
    });
  }, [postsList, searchTerm]);

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert("Please provide both a post title and content.");
      return;
    }

    setIsSubmitting(true);

    if (editingPostId) {
      // Edit existing post
      setPostsList((prev) =>
        prev.map((p) =>
          p.id === editingPostId
            ? {
                ...p,
                title: postTitle.trim(),
                content: postContent.trim(),
                category: postCategory.trim(),
                authorName: postAuthor.trim() || "Foundation Admin",
                imageUrl: postImageUrl.trim() || undefined,
              }
            : p
        )
      );
    } else {
      // Create new post
      const newPost: PostCardData = {
        id: Date.now().toString(),
        title: postTitle.trim(),
        content: postContent.trim(),
        category: postCategory.trim(),
        authorName: postAuthor.trim() || "Foundation Admin",
        createdAt: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        imageUrl: postImageUrl.trim() || undefined,
      };

      setPostsList((prev) => [newPost, ...prev]);
    }

    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setEditingPostId(null);

    // Reset Form
    setPostTitle("");
    setPostContent("");
    setPostCategory("Announcement");
    setPostAuthor("Admin Office");
    setPostImageUrl("");
    setImageFileName("");
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

          {/* Posts Grid Layout (Component used in a clean multi-column grid) */}
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {editingPostId ? "Edit Post" : "Create New Post"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingPostId(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePost} className="space-y-4">
              {/* Post Title */}
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

              {/* Category & Author Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                    Category
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
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                    Author / Department
                  </label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    placeholder="e.g. Scholarship Team"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                  />
                </div>
              </div>

              {/* Upload Image (Optional) */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Upload Cover Image <span className="text-slate-400 font-normal">(Optional)</span>
                </label>

                {!postImageUrl ? (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-[#F7BC0F] rounded-2xl bg-slate-50 hover:bg-amber-50/30 transition cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-amber-800 group-hover:scale-105 transition shadow-2xs mb-2">
                      <ArrowUpTrayIcon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <p className="text-xs font-heading font-bold text-slate-700">
                      Click to upload image
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                      <img
                        src={postImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-heading font-bold text-slate-800 truncate">
                        {imageFileName || "Uploaded Cover Image"}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        Ready to attach
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Remove Image"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Post Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write full details of the announcement, date, venue, instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7BC0F] focus:ring-2 focus:ring-[#F7BC0F]/20 transition"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingPostId(null);
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

            {selectedPost.imageUrl && (
              <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h2 className="font-heading font-bold text-xl text-slate-900 leading-snug">
              {selectedPost.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span>By {selectedPost.authorName || "Foundation Admin"}</span>
              <span>•</span>
              <span>{selectedPost.createdAt}</span>
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

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => router.push("/")}
      />
    </div>
  );
}
