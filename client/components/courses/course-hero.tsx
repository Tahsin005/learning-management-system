"use client";

import Link from "next/link";
import { CheckCircle2, PlayCircle, GraduationCap, Layers, BookOpen, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Course, Lesson } from "@/types/course";

interface CourseHeroProps {
  course: Course;
  isEnrolled: boolean;
  progressPercent: number;
  completedCount: number;
  totalLessons: number;
  firstUncompletedLesson?: Lesson | null;
  onEnroll: () => void;
  isEnrolling: boolean;
  isAuthenticated: boolean;
}

export function CourseHero({
  course,
  isEnrolled,
  progressPercent,
  completedCount,
  totalLessons,
  firstUncompletedLesson,
  onEnroll,
  isEnrolling,
  isAuthenticated,
}: CourseHeroProps) {
  const courseDocId = course.documentId || course.id;
  const lessons = course.lessons || [];
  const lessonsCount = lessons.length;
  const quizzesCount = course.quizzes?.length || 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-card/60 p-6 sm:p-10 shadow-lg">
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 px-3 py-1 font-semibold text-xs">
              Interactive Course
            </Badge>
            {isEnrolled && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-semibold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Enrolled</span>
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2">
            {course.owner && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-xs">
                  {course.owner.username.slice(0, 2).toUpperCase()}
                </div>
                <span>Instructor: <strong className="text-foreground font-semibold">{course.owner.username}</strong></span>
              </div>
            )}
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="h-4 w-4 text-primary" />
              {lessonsCount} Lessons
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="h-4 w-4 text-indigo-400" />
              {quizzesCount} Quizzes
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-md space-y-5">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Course Status
            </span>
            <h3 className="text-lg font-bold text-foreground">
              {isEnrolled ? "Active Enrollment" : "Full Access Available"}
            </h3>
          </div>

          {isEnrolled ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-bold text-primary">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground text-right">
                  {completedCount} of {totalLessons} lessons completed
                </p>
              </div>

              {firstUncompletedLesson ? (
                <Link
                  href={`/courses/${courseDocId}/lessons/${firstUncompletedLesson.documentId || firstUncompletedLesson.id}`}
                  className={cn(buttonVariants({ size: "default" }), "w-full gap-2 bg-primary text-white font-semibold shadow-sm")}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Resume Course</span>
                </Link>
              ) : lessonsCount > 0 ? (
                <Link
                  href={`/courses/${courseDocId}/lessons/${lessons[0].documentId || lessons[0].id}`}
                  className={cn(buttonVariants({ size: "default" }), "w-full gap-2 bg-primary text-white font-semibold shadow-sm")}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Review Lessons</span>
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enroll now to gain instant access to interactive lesson player streams, downloadable resources, and auto-graded assessments.
              </p>

              <Button
                onClick={onEnroll}
                disabled={isEnrolling}
                className="w-full gap-2 bg-primary text-white font-semibold shadow-sm"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enrolling...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4" />
                    <span>{isAuthenticated ? "Enroll Now — Free" : "Sign In to Enroll"}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
