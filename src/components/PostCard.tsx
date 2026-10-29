"use client";

import React from "react";
import Image from "next/image";
import {
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export interface PostCardData {
  id: string;
  title: string;
  content: string;
  category?: string;
  authorName?: string;
  createdAt: string;
  imageUrl?: string;
}

interface PostCardProps {
  post: PostCardData;
  onReadMore?: (post: PostCardData) => void;
  onEdit?: (post: PostCardData) => void;
  onDelete?: (post: PostCardData) => void;
}

export default function PostCard({
  post,
  onReadMore,
  onEdit,
  onDelete,
}: PostCardProps) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-amber-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div onClick={() => onReadMore?.(post)} className="cursor-pointer">
        {/* Optional Post Image Header */}
        {post.imageUrl ? (
          <div className="relative w-full h-48 bg-slate-100 overflow-hidden shrink-0">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {post.category && (
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-slate-800 shadow-sm border border-slate-200/60 backdrop-blur-xs">
                  {post.category}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 pb-0 flex items-center justify-between">
            {post.category ? (
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80">
                {post.category}
              </span>
            ) : (
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Announcement
              </span>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <h3
            className="font-heading font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug"
            title={post.title}
          >
            {post.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {post.content}
          </p>
        </div>
      </div>

      {/* Footer Info & Admin Actions (Edit & Delete) */}
      <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-1.5 text-slate-600 truncate min-w-0">
          <UserCircleIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{post.authorName || "Foundation Admin"}</span>
          <span className="text-slate-300">•</span>
          <span className="shrink-0 text-slate-400">{post.createdAt}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(post);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
            title="Edit Post"
          >
            <PencilSquareIcon className="w-4 h-4 stroke-[2]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(post);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="Delete Post"
          >
            <TrashIcon className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
