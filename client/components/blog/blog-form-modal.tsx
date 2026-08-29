"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Globe,
  FileCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { blogSchema, type BlogFormValues } from "@/lib/validations/blog";
import type { BlogPost } from "@/types/blog";

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BlogFormValues) => void;
  initialData?: BlogPost | null;
  isLoading?: boolean;
}

export function BlogFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: BlogFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      body: "",
      coverImageUrl: "",
      isPublished: true,
    },
  });

  const bodyContent = watch("body") || "";
  const coverImageUrl = watch("coverImageUrl");
  const isPublished = watch("isPublished");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title || "",
          body: initialData.body || "",
          coverImageUrl: initialData.coverImageUrl || "",
          isPublished: !!initialData.publishedAt,
        });
      } else {
        reset({
          title: "",
          body: "",
          coverImageUrl: "",
          isPublished: true,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit: SubmitHandler<BlogFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden border-border/80 bg-card">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {initialData ? "Edit Blog Article" : "Write New Blog Article"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {initialData
                  ? "Update your published content, cover graphics, or release status."
                  : "Craft and publish editorial articles or save drafts to the library."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-1 flex-col overflow-y-auto px-6 py-4 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="blog-title" className="text-xs font-semibold text-foreground">
              Article Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="blog-title"
              placeholder="e.g. Modern Full-Stack Web Architecture in 2026"
              {...register("title")}
              disabled={isLoading}
              className="text-sm font-medium"
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="blog-cover" className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Cover Image URL (Optional)</span>
              <span className="text-[11px] font-normal text-muted-foreground">Unsplash / Cloudinary image URL</span>
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="blog-cover"
                  placeholder="https://images.unsplash.com/photo-..."
                  {...register("coverImageUrl")}
                  disabled={isLoading}
                  className="pl-9 text-xs"
                />
              </div>
            </div>
            {errors.coverImageUrl && (
              <p className="text-xs text-destructive font-medium">{errors.coverImageUrl.message}</p>
            )}

            {coverImageUrl && (
              <div className="relative aspect-[21/9] w-full max-h-36 overflow-hidden rounded-xl border border-border/60 bg-muted/30 mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col min-h-[340px]">
            <Label htmlFor="blogBody" className="text-xs font-semibold text-foreground">
              Article Body (Markdown Supported) <span className="text-destructive">*</span>
            </Label>
            <MarkdownEditor
              id="blogBody"
              value={bodyContent}
              onChange={(val) => setValue("body", val, { shouldValidate: true })}
              placeholder="# Introduction&#10;&#10;Write your article here using standard Markdown...&#10;&#10;### Subheadings&#10;- Key points&#10;- Code snippets"
              minHeight="min-h-[260px]"
              disabled={isLoading}
              error={errors.body?.message}
            />
            {errors.body && (
              <p className="text-xs text-destructive font-medium">{errors.body.message}</p>
            )}
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Publication Status</span>
                {isPublished ? (
                  <Badge className="bg-emerald-500/90 text-white text-[10px] font-medium border-none h-4.5">
                    Published
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/90 text-white text-[10px] font-medium border-none h-4.5">
                    Draft
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isPublished
                  ? "Article will be visible immediately to all students and public visitors."
                  : "Saved privately as a draft. Only Content Managers and Admins can see it."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={isPublished ? "default" : "outline"}
                size="sm"
                onClick={() => setValue("isPublished", true)}
                className="h-7 text-xs px-2.5 gap-1"
              >
                <Globe className="h-3 w-3" />
                Publish
              </Button>
              <Button
                type="button"
                variant={!isPublished ? "secondary" : "outline"}
                size="sm"
                onClick={() => setValue("isPublished", false)}
                className="h-7 text-xs px-2.5 gap-1"
              >
                <FileCheck className="h-3 w-3" />
                Save Draft
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/60 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} size="sm" className="gap-1.5">
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : initialData ? (
                "Save Changes"
              ) : isPublished ? (
                "Publish Article"
              ) : (
                "Save Draft"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
