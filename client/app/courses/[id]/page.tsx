"use client";

import { use } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseDetails } from "@/hooks/use-course-details";

import { CourseHero } from "@/components/courses/course-hero";
import { CurriculumList } from "@/components/courses/curriculum-list";
import { InstructorSidebar } from "@/components/courses/instructor-sidebar";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const resolvedParams = use(params);
  const courseDocId = resolvedParams.id;

  const {
    course,
    isEnrolled,
    lessons,
    completedLessonIds,
    completedCount,
    progressPercent,
    firstUncompletedLesson,
    quizResults,
    isAuthenticated,
    isLoading,
    isError,
    error,
    enroll,
    isEnrolling,
  } = useCourseDetails(courseDocId);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading course syllabus...</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 text-center space-y-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Course Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {error?.message || "The requested course could not be located or may have been unpublished."}
          </p>
          <Link
            href="/courses"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <Breadcrumb className="text-xs">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/courses" />}>
                Courses
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground truncate max-w-xs sm:max-w-md">
                {course.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <CourseHero
          course={course}
          isEnrolled={isEnrolled}
          progressPercent={progressPercent}
          completedCount={completedCount}
          totalLessons={lessons.length}
          firstUncompletedLesson={firstUncompletedLesson}
          onEnroll={() => enroll()}
          isEnrolling={isEnrolling}
          isAuthenticated={isAuthenticated}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <CurriculumList
              course={course}
              isEnrolled={isEnrolled}
              completedLessonIds={completedLessonIds}
              quizResults={quizResults}
              onEnroll={() => enroll()}
            />
          </div>

          <div>
            <InstructorSidebar owner={course.owner} />
          </div>
        </div>
      </main>
    </div>
  );
}
