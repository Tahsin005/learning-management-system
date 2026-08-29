"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCoursesQuery } from "@/hooks/queries/use-course-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import { useAuth } from "@/hooks/use-auth";

export function FeaturedCourses() {
  const { isAuthenticated, roleType } = useAuth();
  const { data: coursesData, isLoading, isError } = useCoursesQuery({
    page: 1,
    pageSize: 6,
  });

  const { data: enrollmentsData } = useMyEnrollmentsQuery(
    1,
    50,
    isAuthenticated && roleType === "student"
  );

  const enrolledCourseIds = new Set<string>();
  if (enrollmentsData?.data) {
    for (const enrollment of enrollmentsData.data) {
      if (enrollment.course?.documentId) {
        enrolledCourseIds.add(enrollment.course.documentId);
      } else if (enrollment.course?.id) {
        enrolledCourseIds.add(String(enrollment.course.id));
      }
    }
  }

  const courses = coursesData?.data || [];

  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-card/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Learning Paths</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Featured Engineering Courses
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Hand-picked curriculum from cloud containerization and backend systems to modern React & Next.js full-stack mastery.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            <span>View All Courses</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-card border-border/60 overflow-hidden animate-pulse">
                <div className="h-40 bg-muted/40" />
                <CardHeader className="space-y-2">
                  <div className="h-5 w-3/4 rounded bg-muted/50" />
                  <div className="h-4 w-1/2 rounded bg-muted/40" />
                </CardHeader>
                <CardContent>
                  <div className="h-12 w-full rounded bg-muted/30" />
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="h-4 w-20 rounded bg-muted/40" />
                  <div className="h-8 w-24 rounded bg-muted/50" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError || courses.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Explore Our Course Catalog</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Ready to dive into industry-standard curriculum? Browse our complete catalog of interactive courses.
              </p>
            </div>
            <Link href="/courses">
              <Button size="sm" className="bg-primary text-white">
                Open Course Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const cDocId = course.documentId || String(course.id);
              const isEnrolled = enrolledCourseIds.has(cDocId);

              return (
                <CourseCard
                  key={cDocId}
                  course={course}
                  isEnrolled={isEnrolled}
                />
              );
            })}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card hover:bg-muted/50 px-6 py-3 text-sm font-medium text-foreground transition-all shadow-sm group"
          >
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Discover all 10 specialized courses & assessments</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
