"use client";

import Link from "next/link";
import { Award, ShieldCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Quiz, QuizSubmissionResponse } from "@/types/course";

interface QuizHeroProps {
  quiz: Quiz;
  activeResult: QuizSubmissionResponse | null;
  courseDocId: string;
  questionsCount: number;
  answeredCount: number;
  progressPct: number;
}

export function QuizHero({
  quiz,
  activeResult,
  courseDocId,
  questionsCount,
  answeredCount,
  progressPct,
}: QuizHeroProps) {
  if (activeResult) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-card/60 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                <span>Assessment Completed</span>
              </Badge>
              <Badge variant="outline" className="bg-muted/80 text-muted-foreground text-xs font-medium border-border/70">
                Single Attempt Recorded
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {activeResult.percentage >= 80 ? "Outstanding Work!" : activeResult.percentage >= 50 ? "Good Effort!" : "Review Recommended"}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              You scored <strong className="text-foreground font-bold">{activeResult.score}</strong> out of{" "}
              <strong className="text-foreground font-bold">{activeResult.totalQuestions}</strong> questions correctly on <span className="text-foreground font-semibold">{quiz.title}</span>.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-card/80 border border-border/80 shadow-md min-w-[170px]">
            <span
              className={cn(
                "text-4xl sm:text-5xl font-extrabold tracking-tight",
                activeResult.percentage >= 70 ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {activeResult.percentage}%
            </span>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1.5">
              Final Score
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Your grade has been permanently archived in your student dashboard.</span>
          </div>

          <Link
            href={`/courses/${courseDocId}`}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5 bg-primary text-white text-xs font-semibold shadow-sm")}
          >
            <span>Back to Syllabus</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-card/60 p-6 sm:p-10 shadow-lg space-y-6">
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 font-semibold text-xs">
              MCQ Assessment
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              {questionsCount} Questions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {quiz.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Answer each question carefully. This assessment allows <strong className="text-foreground">1 single submission</strong>. Your score will be auto-graded and permanently recorded upon submission.
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">
            Completed: <strong className="text-foreground font-semibold">{answeredCount}</strong> / {questionsCount}
          </span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
