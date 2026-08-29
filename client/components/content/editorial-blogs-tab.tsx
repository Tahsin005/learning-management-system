"use client";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  PenTool,
  Search,
  Trash2,
} from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import type { PaginationMeta } from "@/types/course";

interface EditorialBlogsTabProps {
  blogs: BlogPost[];
  pagination: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  statusFilter: "all" | "published" | "draft";
  onStatusFilterChange: (status: "all" | "published" | "draft") => void;
  totalBlogs: number;
  publishedBlogsCount: number;
  draftBlogsCount: number;
  isLoading: boolean;
  onOpenNewBlog: () => void;
  onOpenEditBlog: (blog: BlogPost) => void;
  onTogglePublishBlog: (blog: BlogPost) => void;
  onDeleteBlog: (blog: BlogPost) => void;
}

export function EditorialBlogsTab({
  blogs,
  pagination,
  currentPage,
  onPageChange,
  search,
  onSearchChange,
  onSearchSubmit,
  statusFilter,
  onStatusFilterChange,
  totalBlogs,
  publishedBlogsCount,
  draftBlogsCount,
  isLoading,
  onOpenNewBlog,
  onOpenEditBlog,
  onTogglePublishBlog,
  onDeleteBlog,
}: EditorialBlogsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={onSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search articles by title..."
            className="pl-10 h-10 rounded-xl text-xs"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center rounded-xl border border-border/60 bg-muted/40 p-0.5 text-xs">
            <button
              onClick={() => onStatusFilterChange("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                statusFilter === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground"
              )}
            >
              All ({totalBlogs})
            </button>
            <button
              onClick={() => onStatusFilterChange("published")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                statusFilter === "published"
                  ? "bg-emerald-500/20 text-emerald-400 shadow-xs"
                  : "text-muted-foreground"
              )}
            >
              Published ({publishedBlogsCount})
            </button>
            <button
              onClick={() => onStatusFilterChange("draft")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                statusFilter === "draft"
                  ? "bg-amber-500/20 text-amber-400 shadow-xs"
                  : "text-muted-foreground"
              )}
            >
              Drafts ({draftBlogsCount})
            </button>
          </div>

          <Button
            onClick={onOpenNewBlog}
            size="sm"
            className="gap-1.5 rounded-xl h-10 font-semibold"
          >
            <PenTool className="h-3.5 w-3.5" />
            Write Article
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-2xl border border-border/40 bg-card/40 animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-3xl border border-border/80 bg-card/40 p-12 text-center max-w-md mx-auto my-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No articles in this view</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Draft a new editorial post or publish one to the learning community.
          </p>
          <Button onClick={onOpenNewBlog} size="sm" className="mt-4 gap-1.5">
            <PenTool className="h-3.5 w-3.5" />
            Write Article
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post) => (
            <div key={post.documentId || post.id} className="relative group">
              <BlogCard
                post={post}
                isStaff={true}
                onEdit={onOpenEditBlog}
                onTogglePublish={onTogglePublishBlog}
              />
              <button
                onClick={() => onDeleteBlog(post)}
                className="absolute top-3 right-3 z-20 h-7 w-7 rounded-full bg-background/80 text-muted-foreground hover:text-destructive flex items-center justify-center backdrop-blur-md shadow-sm border border-border/50 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
                title="Delete Article"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination.pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-border/60">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="gap-1 rounded-xl text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground font-medium px-2">
            Page {currentPage} of {pagination.pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pagination.pageCount, currentPage + 1))}
            disabled={currentPage >= pagination.pageCount}
            className="gap-1 rounded-xl text-xs"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
