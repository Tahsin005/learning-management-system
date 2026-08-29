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
import { courseSchema, type CourseFormValues } from "@/lib/validations/course";
import type { Course } from "@/types/course";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CourseFormValues) => Promise<void> | void;
  course?: Course | null;
  isLoading: boolean;
}

export function CourseFormModal({
  isOpen,
  onClose,
  onSubmit,
  course,
  isLoading,
}: CourseFormModalProps) {
  const isEditing = !!course;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (course) {
      reset({
        title: course.title || "",
        description: course.description || "",
      });
    } else {
      reset({
        title: "",
        description: "",
      });
    }
  }, [course, reset, isOpen]);

  const handleFormSubmit = async (values: CourseFormValues) => {
    try {
      await onSubmit(values);
      onClose();
    } catch {
      // handled by mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Edit Course Details" : "Create New Course"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Update course title and syllabus description"
              : "Provision a new course offering in your instructor catalog"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Course Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Master Enterprise TypeScript Architecture"
              disabled={isLoading}
              className="bg-muted/20"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Course Description
            </Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Detailed syllabus overview and what students will achieve..."
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
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
                  <span>Update Course</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Course</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
