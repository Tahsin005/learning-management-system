"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Save, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { lessonSchema, type LessonFormValues } from "@/lib/validations/course";
import type { Lesson } from "@/types/course";

interface LessonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormValues) => Promise<void> | void;
  lesson?: Lesson | null;
  isLoading: boolean;
}

export function LessonFormModal({
  isOpen,
  onClose,
  onSubmit,
  lesson,
  isLoading,
}: LessonFormModalProps) {
  const isEditing = !!lesson;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
    },
  });

  const lessonContent = watch("content") || "";

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title || "",
        content: lesson.content || "",
        videoUrl: lesson.videoUrl || "",
      });
    } else {
      reset({
        title: "",
        content: "",
        videoUrl: "",
      });
    }
  }, [lesson, reset, isOpen]);

  const handleFormSubmit = (values: LessonFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-border/80 bg-card">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {isEditing ? "Edit Lesson Module" : "Add Lesson Module"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Update lesson curriculum notes, code walkthroughs, and video stream link."
                  : "Create a new sequential lesson module under this course."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-1 flex-col overflow-y-auto px-6 py-4 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="lessonTitle" className="text-xs font-semibold text-foreground">
              Lesson Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lessonTitle"
              placeholder="e.g. 1. Introduction to Next.js App Router & Server Components"
              disabled={isLoading}
              className="text-sm font-medium"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="videoUrl" className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Video Stream URL (Optional)</span>
              <span className="text-[11px] font-normal text-muted-foreground">YouTube or direct MP4 stream URL</span>
            </Label>
            <Input
              id="videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isLoading}
              className="text-xs"
              {...register("videoUrl")}
            />
            {errors.videoUrl && (
              <p className="text-xs text-destructive font-medium">{errors.videoUrl.message}</p>
            )}
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col min-h-[280px]">
            <Label htmlFor="lessonContent" className="text-xs font-semibold text-foreground">
              Lesson Content & Code Notes (Markdown Supported)
            </Label>
            <MarkdownEditor
              id="lessonContent"
              value={lessonContent}
              onChange={(val) => setValue("content", val, { shouldValidate: true })}
              placeholder="# Overview&#10;&#10;Explain the concepts, architectures, and code snippets covered in this lesson..."
              minHeight="min-h-[220px]"
              disabled={isLoading}
              error={errors.content?.message}
            />
            {errors.content && (
              <p className="text-xs text-destructive font-medium">{errors.content.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-border/60 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="gap-1.5 bg-primary text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Lesson</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Lesson</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
