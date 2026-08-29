"use client";

import Link from "next/link";
import { ArrowRight, Newspaper, User, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPostsQuery } from "@/hooks/queries/use-blog-queries";

export function LatestBlogs() {
  const { data: blogsData, isLoading, isError } = useBlogPostsQuery({
    page: 1,
    pageSize: 3,
  });

  const posts = blogsData?.data || [];

  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Editorial Knowledge Base</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Latest Engineering Insights
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Deep dives, architectural breakdowns, and software engineering best practices written by instructors and content managers.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card border-border/60 overflow-hidden animate-pulse">
                <CardHeader className="space-y-3">
                  <div className="h-4 w-24 rounded bg-muted/40" />
                  <div className="h-6 w-full rounded bg-muted/50" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-12 w-full rounded bg-muted/30" />
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="h-4 w-20 rounded bg-muted/40" />
                  <div className="h-4 w-16 rounded bg-muted/40" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError || posts.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Newspaper className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Read Tech Insights</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Explore tech articles and deep dives created by our community.
              </p>
            </div>
            <Link href="/blog">
              <Button size="sm" variant="outline">
                Visit Tech Blog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const postDocId = post.documentId || String(post.id);
              const authorName = post.author?.username || "Editorial Team";
              const publishDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Published";

              return (
                <Card
                  key={postDocId}
                  className="flex flex-col justify-between border-border/80 bg-card/70 hover:border-primary/50 transition-all shadow-sm group"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs font-medium"
                      >
                        Engineering
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {publishDate}
                      </span>
                    </div>

                    <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.body
                        ? post.body.replace(/[#*`_\[\]]/g, "").slice(0, 140) + "..."
                        : "Discover modern engineering patterns and architectural best practices."}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="pt-0 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-primary" />
                      {authorName}
                    </span>
                    <Link
                      href={`/blog/${postDocId}`}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
