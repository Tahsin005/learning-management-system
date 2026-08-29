"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  PlusCircle,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Course, PaginationMeta } from "@/types/course";

interface CoursesLibraryTabProps {
  courses: Course[];
  pagination: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onOpenNewCourse: () => void;
  onOpenEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

export function CoursesLibraryTab({
  courses,
  pagination,
  currentPage,
  onPageChange,
  search,
  onSearchChange,
  onSearchSubmit,
  isLoading,
  onOpenNewCourse,
  onOpenEditCourse,
  onDeleteCourse,
}: CoursesLibraryTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={onSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses across the platform..."
            className="pl-10 h-10 rounded-xl text-xs"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button onClick={onOpenNewCourse} size="sm" className="gap-1.5 rounded-xl h-10 font-semibold">
            <PlusCircle className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl border border-border/40 bg-card/40 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-border/80 bg-card/40 p-12 text-center max-w-md mx-auto my-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No courses found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Get started by creating your first learning course for the platform.
          </p>
          <Button onClick={onOpenNewCourse} size="sm" className="mt-4 gap-1.5">
            <PlusCircle className="h-3.5 w-3.5" />
            Create Course
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const courseDocId = course.documentId || String(course.id);
            const lessonsCount = course.lessons?.length || 0;
            const quizzesCount = course.quizzes?.length || 0;
            const ownerName = course.owner?.username || "Instructor";

            return (
              <Card
                key={courseDocId}
                className="flex flex-col justify-between border-border/80 bg-card hover:border-indigo-500/40 transition-all shadow-sm group"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-semibold text-[11px]"
                    >
                      Instructor: {ownerName}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => onOpenEditCourse(course)}
                        title="Edit Course Settings"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteCourse(course)}
                        title="Delete Course"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>

                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {course.description || "No description provided."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-2 border-y border-border/40 bg-muted/20">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Layers className="h-3.5 w-3.5 text-primary/70" />
                      <span>
                        <strong className="text-foreground font-semibold">{lessonsCount}</strong> Lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70" />
                      <span>
                        <strong className="text-foreground font-semibold">{quizzesCount}</strong> Quizzes
                      </span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 pt-3 flex items-center justify-between gap-2">
                  <Link
                    href={`/courses/${courseDocId}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "h-8 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Public View
                  </Link>

                  <Link
                    href={`/instructor/courses/${courseDocId}`}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "h-8 text-xs font-semibold rounded-xl"
                    )}
                  >
                    Manage Curriculum
                  </Link>
                </div>
              </Card>
            );
          })}
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
