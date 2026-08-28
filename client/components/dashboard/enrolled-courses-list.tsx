"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { cn } from "@/lib/utils";
import type { Enrollment } from "@/types/course";

interface EnrolledCoursesListProps {
  enrollments: Enrollment[];
  isLoading: boolean;
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function EnrolledCoursesList({
  enrollments,
  isLoading,
  page,
  pageCount,
  total,
  onPageChange,
}: EnrolledCoursesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-card border-border/60 p-6 space-y-3 animate-pulse">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted/60" />
            <div className="h-10 w-full rounded bg-muted/40" />
          </Card>
        ))}
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <Card className="border-border/60 bg-card/60 p-10 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No Courses Enrolled Yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Explore our course catalog to find hands-on learning paths and start building your skills today.
        </p>
        <div className="pt-2">
          <Link
            href="/courses"
            className={cn(buttonVariants({ size: "sm" }), "bg-primary text-white font-semibold")}
          >
            Browse Catalog
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => (
          <EnrolledCourseCard
            key={enrollment.documentId || enrollment.id}
            enrollment={enrollment}
          />
        ))}
      </div>

      <PaginationBar
        page={page}
        pageCount={pageCount}
        total={total}
        itemLabel="Enrolled Courses"
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
