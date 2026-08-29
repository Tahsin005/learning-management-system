"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BlogFormModal } from "@/components/blog/blog-form-modal";
import { useUpdateBlogMutation } from "@/hooks/queries/use-blog-queries";
import type { BlogPost } from "@/types/blog";
import type { BlogFormValues } from "@/lib/validations/blog";
import { FileText, Search, ExternalLink, User, Edit, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalBlogsTableProps {
  blogs?: BlogPost[];
  isLoading?: boolean;
}

export function GlobalBlogsTable({
  blogs = [],
  isLoading,
}: GlobalBlogsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateBlogMutation = useUpdateBlogMutation();

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [blogs, searchQuery]);

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleUpdateBlog = (values: BlogFormValues) => {
    if (!editingBlog) return;

    updateBlogMutation.mutate(
      {
        documentId: editingBlog.documentId || String(editingBlog.id),
        data: values,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingBlog(null);
        },
      }
    );
  };

  return (
    <>
      <Card className="bg-card border-border/60 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Platform Blog & Publication Control
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Oversight of all published articles and drafts across the platform.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Total Articles: <strong className="text-foreground">{filteredBlogs.length}</strong>
              </span>
            </div>
          </div>

          <div className="pt-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by article title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-muted/30 border-border/60 focus:bg-background"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading blog directory...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">No articles found</p>
              <p>Try adjusting your search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-y border-border/60 bg-muted/20 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredBlogs.map((b) => {
                    const isPublished = Boolean(b.publishedAt);

                    return (
                      <tr key={b.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground max-w-xs truncate">
                            {b.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-xs mt-0.5">
                            ID: {b.documentId || b.id}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            {b.author?.username || "—"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isPublished ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] gap-1 font-semibold">
                              <CheckCircle2 className="h-3 w-3" /> Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] gap-1 font-semibold">
                              <Clock className="h-3 w-3" /> Draft
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {b.publishedAt
                            ? new Date(b.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Unpublished"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/blog/${b.documentId || b.id}`}
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "sm" }),
                                "h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Read
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(b)}
                              className="h-7 text-xs px-2.5 gap-1 border-border/80 hover:border-primary/50 hover:bg-primary/10"
                            >
                              <Edit className="h-3 w-3 text-primary" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBlog(null);
        }}
        onSubmit={handleUpdateBlog}
        initialData={editingBlog}
        isLoading={updateBlogMutation.isPending}
      />
    </>
  );
}
