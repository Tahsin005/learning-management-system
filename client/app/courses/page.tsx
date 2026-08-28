"use client";

import { useState } from "react";
import { useCoursesQuery } from "@/hooks/queries/use-course-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Sparkles, GraduationCap } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { PaginationBar } from "@/components/ui/pagination-bar";

export default function CoursesPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading, isError, error } = useCoursesQuery({
    page,
    pageSize: 9,
    search: activeSearch,
  });

  const { data: enrollmentsData } = useMyEnrollmentsQuery(1, 100, isAuthenticated);

  const courses = data?.data || [];
  const enrollments = enrollmentsData?.data || [];
  const enrolledCourseIds = new Set(
    enrollments.map((e) => e.course?.documentId || String(e.course?.id))
  );

  const pagination = data?.meta?.pagination || {
    page: 1,
    pageSize: 9,
    pageCount: 1,
    total: 0,
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(search);
    setPage(1);
  };

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Learning Paths</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Explore Available Courses
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Master modern software engineering with structured modules, hands-on lessons, and interactive assessments.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full md:w-80"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border/80 h-10"
              />
            </div>
            <Button type="submit" size="sm" className="h-10 px-4 bg-primary text-white">
              Search
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-card border-border/60 overflow-hidden animate-pulse">
                <div className="h-36 bg-muted/40" />
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
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
            <h3 className="text-lg font-semibold text-destructive">Failed to Load Courses</h3>
            <p className="text-sm text-muted-foreground">
              {error?.message || "There was an error connecting to the courses API. Please ensure the backend is running."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSearch("")}
            >
              Try Again
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">No Courses Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {activeSearch
                  ? `No courses matched your query "${activeSearch}". Try searching for another keyword.`
                  : "There are no published courses currently available. Check back soon!"}
              </p>
            </div>
            {activeSearch && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setActiveSearch("");
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
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

            <PaginationBar
              page={page}
              pageCount={pagination.pageCount}
              total={pagination.total}
              itemLabel="Courses"
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
