"use client";

import Link from "next/link";
import { HelpCircle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { cn } from "@/lib/utils";
import type { QuizResultRecord } from "@/types/course";

interface QuizScoresListProps {
  quizResults: QuizResultRecord[];
  isLoading: boolean;
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
  onSelectResult: (result: QuizResultRecord) => void;
}

export function QuizScoresList({
  quizResults,
  isLoading,
  page,
  pageCount,
  total,
  onPageChange,
  onSelectResult,
}: QuizScoresListProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-card border border-border/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (quizResults.length === 0) {
    return (
      <Card className="border-border/60 bg-card/60 p-12 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <HelpCircle className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">No Quiz Results Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Take course quizzes to test your knowledge and track your progress here.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/courses"
            className={cn(buttonVariants({ size: "sm" }), "bg-primary text-white font-semibold")}
          >
            Explore Courses
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {quizResults.map((res) => {
          const percentage =
            res.totalQuestions > 0 ? Math.round((res.score / res.totalQuestions) * 100) : 0;
          const isPassed = percentage >= 70;

          return (
            <div
              key={res.documentId || res.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm hover:border-primary/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs border",
                    isPassed
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                  )}
                >
                  {percentage}%
                </div>

                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {res.quiz?.title || "Course Assessment"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted on {formatDate(res.submittedAt)} • Score: {res.score} / {res.totalQuestions}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold",
                    isPassed
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                  )}
                >
                  {isPassed ? "Passed" : "Needs Review"}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectResult(res)}
                  className="gap-1.5 text-xs font-semibold border-border hover:border-primary/50"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>View Details</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <PaginationBar
        page={page}
        pageCount={pageCount}
        total={total}
        itemLabel="Quiz Submissions"
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
