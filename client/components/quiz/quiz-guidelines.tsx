"use client";

import Link from "next/link";
import { BookOpen, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

interface QuizGuidelinesProps {
  course?: Course | null;
  courseDocId: string;
}

export function QuizGuidelines({ course, courseDocId }: QuizGuidelinesProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Associated Course
          </span>
          <CardTitle className="text-base font-bold text-foreground line-clamp-2">
            {course?.title || "Course Details"}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Instructor: {course?.owner?.username || "Scholler Faculty"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <Link
            href={`/courses/${courseDocId}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full gap-2 text-xs font-semibold")}
          >
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Return to Full Syllabus</span>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span>Assessment Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 text-xs text-muted-foreground pt-0">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Auto-graded instantaneously by server grading policy.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Single attempt submission.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Results and breakdown stored on your dashboard.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
