"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Save } from "lucide-react";
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
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
    },
  });

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

  const handleFormSubmit = async (values: LessonFormValues) => {
    try {
      await onSubmit(values);
      onClose();
    } catch {
      // handled by mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Edit Lesson Module" : "Add Lesson Module"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Update lesson notes, title, and video stream link"
              : "Create a new sequential lesson under this course"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="lessonTitle" className="text-xs font-semibold">
              Lesson Title
            </Label>
            <Input
              id="lessonTitle"
              placeholder="e.g. 1. Introduction to Next.js App Router"
              disabled={isLoading}
              className="bg-muted/20"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="videoUrl" className="text-xs font-semibold">
              Video Stream URL (YouTube or Direct MP4)
            </Label>
            <Input
              id="videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isLoading}
              className="bg-muted/20 text-xs"
              {...register("videoUrl")}
            />
            {errors.videoUrl && (
              <p className="text-xs text-destructive">{errors.videoUrl.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lessonContent" className="text-xs font-semibold">
              Lesson Content & Code Notes (Markdown supported)
            </Label>
            <textarea
              id="lessonContent"
              rows={6}
              placeholder="Comprehensive markdown notes, code snippets, and instructions..."
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3">
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
