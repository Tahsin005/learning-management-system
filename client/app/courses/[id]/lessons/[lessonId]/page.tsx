"use client";

import { use } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Lock,
  Loader2,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/ui/markdown";
import { useLessonPlayer } from "@/hooks/use-lesson-player";

import { LessonVideoPlayer } from "@/components/lessons/lesson-video-player";
import { LessonNavigation } from "@/components/lessons/lesson-navigation";
import { LessonSidebar } from "@/components/lessons/lesson-sidebar";

interface LessonPlayerPageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default function LessonPlayerPage({ params }: LessonPlayerPageProps) {
  const resolvedParams = use(params);
  const courseDocId = resolvedParams.id;
  const lessonDocId = resolvedParams.lessonId;

  const {
    course,
    lesson,
    lessons,
    quizzes,
    completedLessonIds,
    isCurrentCompleted,
    currentIndex,
    prevLesson,
    nextLesson,
    firstQuiz,
    firstQuizResult,
    myQuizResults,
    isAuthenticated,
    isLoading,
    isLessonError,
    toggleComplete,
    enroll,
    isUpdatingProgress,
    isEnrolling,
  } = useLessonPlayer(courseDocId, lessonDocId);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading lesson player...</p>
      </div>
    );
  }

  if (isLessonError) {
    return (
      <main className="flex-1 container mx-auto max-w-xl px-4 py-20 text-center space-y-6">
        <Card className="border-border/80 bg-card/90 p-8 shadow-xl">
          <CardContent className="flex flex-col items-center p-0 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Enrollment Required
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You must be enrolled in this course to access lesson video streams, interactive code notes, and exercises.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row w-full gap-3">
              <Button
                onClick={() => enroll()}
                disabled={isEnrolling}
                className="flex-1 gap-2 bg-primary text-white"
              >
                <GraduationCap className="h-4 w-4" />
                <span>{isAuthenticated ? "Enroll to Unlock" : "Sign In to Enroll"}</span>
              </Button>
              <Link
                href={`/courses/${courseDocId}`}
                className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
              >
                Course Overview
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/courses" />}>
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href={`/courses/${courseDocId}`} />}
                  className="truncate max-w-[150px] sm:max-w-xs"
                >
                  {course?.title || "Course"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground truncate max-w-[180px] sm:max-w-xs">
                  {lesson?.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link
            href={`/courses/${courseDocId}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-xs w-fit")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Course Syllabus</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <LessonVideoPlayer
              videoUrl={lesson?.videoUrl}
              lessonTitle={lesson?.title}
            />

            <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-primary">
                  Lesson {currentIndex >= 0 ? `#${currentIndex + 1}` : ""}
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {lesson?.title}
                </h1>
              </div>

              <div className="pt-2 border-t border-border/60">
                <Markdown content={lesson?.content || "No lesson notes available for this section."} />
              </div>

              <LessonNavigation
                courseDocId={courseDocId}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                firstQuiz={firstQuiz}
                firstQuizResult={firstQuizResult}
                isCurrentCompleted={isCurrentCompleted}
                isUpdatingProgress={isUpdatingProgress}
                onToggleComplete={() => toggleComplete()}
              />
            </div>
          </div>

          <div>
            <LessonSidebar
              courseDocId={courseDocId}
              currentLessonDocId={lessonDocId}
              lessons={lessons}
              quizzes={quizzes}
              completedLessonIds={completedLessonIds}
              quizResults={myQuizResults}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
