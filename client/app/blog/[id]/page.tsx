"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Eye, EyeOff, Share2, Sparkles } from "lucide-react";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPostQuery } from "@/hooks/queries/use-blog-queries";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function SingleBlogPostPage({ params }: BlogPostPageProps) {
  const { id } = use(params);
  const { roleType } = useAuth();
  const isStaff = roleType === "admin" || roleType === "content_manager";

  const { data, isLoading, error } = useBlogPostQuery(id);
  const post = data?.data;

  const isPublished = !!post?.publishedAt;
  const wordCount = post?.body?.trim().split(/\s+/).length || 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = post?.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleCopyLink = async () => {
    if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Article link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link to clipboard.");
      }
    } else {
      toast.error("Clipboard operations are not supported in this browser.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
          <div className="h-6 w-24 bg-muted/40 rounded-md animate-pulse mb-8" />
          <div className="h-10 w-3/4 bg-muted/40 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-1/3 bg-muted/40 rounded-md animate-pulse mb-8" />
          <div className="aspect-[21/9] w-full bg-muted/40 rounded-2xl animate-pulse mb-10" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted/40 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-4 w-4/6 bg-muted/40 rounded-md animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md p-8 rounded-3xl border border-border/80 bg-card">
            <h2 className="text-2xl font-bold text-foreground">Article Not Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The article you are looking for may have been removed, unpublished, or is unavailable.
            </p>
            <Link href="/blog" className="mt-6 inline-block">
              <Button variant="default" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>

          <div className="flex items-center gap-2">
            {isStaff && (
              <Badge
                className={
                  isPublished
                    ? "bg-emerald-500/90 text-white gap-1"
                    : "bg-amber-500/90 text-white gap-1"
                }
              >
                {isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {isPublished ? "Published" : "Draft (Internal)"}
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 text-xs gap-1.5 rounded-lg"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          </div>
        </div>

        <header className="mb-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2 border-b border-border/50 pb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-xs ring-2 ring-primary/20">
                {(post.author?.username || "E").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-foreground block">
                  {post.author?.username || "Editorial Team"}
                </span>
                <span className="text-[11px] text-muted-foreground">Author</span>
              </div>
            </div>

            <span className="hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{readingTimeMinutes} min read</span>
            </div>
          </div>
        </header>

        {post.coverImageUrl && (
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/40 mb-10 shadow-lg">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <Markdown content={post.body} />
        </article>

        <div className="mt-14 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-card/60 p-6 border">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-base shadow-sm ring-2 ring-primary/20">
              {(post.author?.username || "E").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Written by {post.author?.username || "Editorial Team"}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Staff contributor at Learning Management System Platform.
              </p>
            </div>
          </div>

          <Link href="/blog">
            <Button variant="outline" size="sm" className="text-xs rounded-xl">
              More Articles
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
