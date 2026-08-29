"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { useBlogPostsQuery } from "@/hooks/queries/use-blog-queries";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogCatalogPage() {
  const { roleType } = useAuth();
  const isStaff = roleType === "admin" || roleType === "content_manager";

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useBlogPostsQuery({
    page,
    pageSize: 9,
    search: activeSearch,
    status: isStaff ? undefined : "published",
  });

  const posts = data?.data || [];
  const pagination = data?.meta?.pagination || {
    page: 1,
    pageSize: 9,
    pageCount: 1,
    total: 0,
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(search);
    setPage(1);
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const standardPosts = posts.length > 1 ? posts.slice(1) : posts;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card via-card/80 to-background p-8 md:p-12 mb-12 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Engineering & Learning Insights</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Knowledge Hub & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-emerald-400">
                Engineering Articles
              </span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Explore in-depth tutorials, full-stack architectural deep dives, learning patterns, and product updates written by our instructors and content managers.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles by title or keyword..."
                  className="pl-10 h-11 rounded-xl bg-card border-border text-sm"
                />
              </div>
              <Button type="submit" className="h-11 px-6 rounded-xl font-semibold gap-1.5 shadow-sm">
                Search
              </Button>
            </form>
          </div>
        </div>

        {isStaff && (
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <Sparkles className="h-4 w-4" />
              <span>You are logged in as staff. You have full access to view drafts and manage blog articles.</span>
            </div>
            <Link href="/content">
              <Button size="sm" variant="default" className="h-8 text-xs font-semibold">
                Open Content Studio
              </Button>
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl border border-border/40 bg-card/40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-12 text-center max-w-lg mx-auto my-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Failed to load articles</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message || "An unexpected error occurred while fetching articles."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4 gap-1.5"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Try Again
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-border/80 bg-card/40 p-12 text-center max-w-lg mx-auto my-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No articles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeSearch
                ? `No articles matched "${activeSearch}". Try searching for another topic.`
                : "No published blog articles are available yet. Check back soon!"}
            </p>
            {activeSearch && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setActiveSearch("");
                }}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {page === 1 && !activeSearch && featuredPost && (
              <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-md transition-all hover:border-primary/50 hover:shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="relative aspect-[16/9] lg:aspect-auto lg:col-span-7 overflow-hidden bg-muted/40 min-h-[260px]">
                    {featuredPost.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredPost.coverImageUrl}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-indigo-950/40">
                        <span className="text-6xl font-black text-muted-foreground/15">FEATURED</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 shadow-md">
                        Featured Post
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span className="font-semibold text-foreground">
                          {featuredPost.author?.username || "Editorial Team"}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(
                            featuredPost.publishedAt || featuredPost.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredPost.documentId || featuredPost.id}`}>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                      </Link>

                      <p className="mt-3 text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {(featuredPost.body || "")
                          .replace(/[#*`_~>[\]]/g, "")
                          .slice(0, 240)
                          .trim()}
                        ...
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between">
                      <Link href={`/blog/${featuredPost.documentId || featuredPost.id}`}>
                        <Button className="font-semibold gap-2 rounded-xl">
                          Read Article
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Latest Articles</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {pagination.total}
                  </Badge>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(page === 1 && !activeSearch ? standardPosts : posts).map((post) => (
                  <BlogCard key={post.documentId || post.id} post={post} isStaff={isStaff} />
                ))}
              </div>
            </div>

            {pagination.pageCount > 1 && (
              <div className="flex items-center justify-center gap-3 pt-8 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="gap-1 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground font-medium px-2">
                  Page {page} of {pagination.pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.pageCount, p + 1))}
                  disabled={page >= pagination.pageCount}
                  className="gap-1 rounded-xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
