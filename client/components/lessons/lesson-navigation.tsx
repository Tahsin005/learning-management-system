"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Award, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lesson, Quiz, QuizResultRecord } from "@/types/course";

interface LessonNavigationProps {
  courseDocId: string;
  prevLesson?: Lesson | null;
  nextLesson?: Lesson | null;
  firstQuiz?: Quiz | null;
  firstQuizResult?: QuizResultRecord | null;
  isCurrentCompleted: boolean;
  isUpdatingProgress: boolean;
  onToggleComplete: () => void;
}

export function LessonNavigation({
  courseDocId,
  prevLesson,
  nextLesson,
  firstQuiz,
  firstQuizResult,
  isCurrentCompleted,
  isUpdatingProgress,
  onToggleComplete,
}: LessonNavigationProps) {
  const isQuizCompleted = !!firstQuizResult;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
      <div>
        {prevLesson ? (
          <Link
            href={`/courses/${courseDocId}/lessons/${prevLesson.documentId || prevLesson.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs font-semibold")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Lesson</span>
          </Link>
        ) : (
          <div className="w-24" />
        )}
      </div>

      <Button
        onClick={onToggleComplete}
        disabled={isUpdatingProgress}
        variant={isCurrentCompleted ? "outline" : "default"}
        size="sm"
        className={cn(
          "gap-2 text-xs font-semibold transition-all",
          isCurrentCompleted
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            : "bg-primary text-white"
        )}
      >
        {isUpdatingProgress ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        <span>{isCurrentCompleted ? "Completed" : "Mark as Completed"}</span>
      </Button>

      <div>
        {nextLesson ? (
          <Link
            href={`/courses/${courseDocId}/lessons/${nextLesson.documentId || nextLesson.id}`}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5 bg-primary text-white text-xs font-semibold")}
          >
            <span>Next Lesson</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : firstQuiz ? (
          <Link
            href={`/courses/${courseDocId}/quizzes/${firstQuiz.documentId || firstQuiz.id}`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 text-xs font-semibold",
              isQuizCompleted
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            )}
          >
            <Award className="h-3.5 w-3.5" />
            <span>{isQuizCompleted ? "View Quiz Result" : "Proceed to Quiz"}</span>
          </Link>
        ) : (
          <div className="w-24" />
        )}
      </div>
    </div>
  );
}
