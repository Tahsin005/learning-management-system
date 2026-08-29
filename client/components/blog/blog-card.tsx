"use client";

import Link from "next/link";
import { Calendar, User, Clock, ArrowRight, FileEdit, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  isStaff?: boolean;
  onEdit?: (post: BlogPost) => void;
  onTogglePublish?: (post: BlogPost) => void;
}

export function BlogCard({ post, isStaff, onEdit, onTogglePublish }: BlogCardProps) {
  const isPublished = !!post.publishedAt;
  
  // Calculate reading time (assuming ~200 wpm)
  const wordCount = post.body?.trim().split(/\s+/).length || 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Strip markdown characters for a clean card snippet
  const snippet = (post.body || "")
    .replace(/[#*`_~>[\]]/g, "")
    .slice(0, 160)
    .trim()
    .concat("...");

  const docId = post.documentId || post.id;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/40">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950/40 via-background to-primary/10">
            <span className="text-4xl font-black text-muted-foreground/20">LMS</span>
          </div>
        )}

        {isStaff && (
          <div className="absolute top-3 left-3 z-10">
            {isPublished ? (
              <Badge className="bg-emerald-500/90 text-white font-medium border-none shadow-md backdrop-blur-md gap-1.5 py-0.5">
                <Eye className="h-3 w-3" />
                Published
              </Badge>
            ) : (
              <Badge className="bg-amber-500/90 text-white font-medium border-none shadow-md backdrop-blur-md gap-1.5 py-0.5">
                <EyeOff className="h-3 w-3" />
                Draft
              </Badge>
            )}
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-md">
          <Clock className="h-3 w-3" />
          <span>{readingTimeMinutes} min read</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium text-foreground/80">
              {post.author?.username || "Editorial Team"}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Link href={`/blog/${docId}`} className="group-hover:text-primary transition-colors">
          <h3 className="line-clamp-2 text-lg font-bold text-foreground tracking-tight leading-snug">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground/90 leading-relaxed flex-1">
          {snippet}
        </p>

        <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
          <Link
            href={`/blog/${docId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Read Full Article
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          {isStaff && onEdit && (
            <div className="flex items-center gap-1.5">
              {onTogglePublish && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onTogglePublish(post);
                  }}
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                >
                  {isPublished ? "Unpublish" : "Publish"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(post);
                }}
                className="h-7 text-xs px-2.5 gap-1"
              >
                <FileEdit className="h-3 w-3" />
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
