"use client";

import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StudentProgressTable } from "@/components/instructor/student-progress-table";
import type { Enrollment, QuizResultRecord } from "@/types/course";

interface GlobalGradebookTabProps {
  enrollments: Enrollment[];
  quizResults: QuizResultRecord[];
  isLoading: boolean;
  totalLessons: number;
  totalQuizzes: number;
}

export function GlobalGradebookTab({
  enrollments,
  quizResults,
  isLoading,
  totalLessons,
  totalQuizzes,
}: GlobalGradebookTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Platform-Wide Student Enrollments & Performance
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time analytics for all enrolled students across every course on the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {enrollments.length} Total Enrolled
          </Badge>
        </div>
      </div>

      <StudentProgressTable
        enrollments={enrollments}
        quizResults={quizResults}
        isLoading={isLoading}
        totalLessons={totalLessons}
        totalQuizzes={totalQuizzes}
      />
    </div>
  );
}
