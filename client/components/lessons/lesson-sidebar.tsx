"use client";

import Link from "next/link";
import { CheckCircle2, PlayCircle, BookOpen, Layers, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Lesson, Quiz, QuizResultRecord } from "@/types/course";

interface LessonSidebarProps {
  courseDocId: string;
  currentLessonDocId: string;
  lessons: Lesson[];
  quizzes: Quiz[];
  completedLessonIds: string[];
  quizResults: QuizResultRecord[];
}

export function LessonSidebar({
  courseDocId,
  currentLessonDocId,
  lessons,
  quizzes,
  completedLessonIds,
  quizResults,
}: LessonSidebarProps) {
  const completedCount = completedLessonIds.length;
  const progressPct =
    lessons.length > 0
      ? Math.min(100, Math.round((completedCount / lessons.length) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Course Syllabus</span>
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{lessons.length} Completed
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
          {lessons.map((l, idx) => {
            const lDocId = String(l.documentId || l.id);
            const isCurrent = lDocId === String(currentLessonDocId);
            const isCompleted = completedLessonIds.includes(lDocId);

            return (
              <Link
                key={lDocId}
                href={`/courses/${courseDocId}/lessons/${lDocId}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl p-3 text-xs transition-all",
                  isCurrent
                    ? "bg-primary/10 text-foreground font-semibold border border-primary/30 shadow-xs"
                    : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold",
                      isCurrent
                        ? "border-primary bg-primary text-white"
                        : isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-border/70 bg-muted/40 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="truncate">{l.title}</span>
                </div>

                {isCurrent && (
                  <PlayCircle className="h-3.5 w-3.5 shrink-0 text-primary animate-pulse" />
                )}
              </Link>
            );
          })}

          {quizzes.length > 0 && (
            <div className="pt-3 border-t border-border/40 mt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Assessments
              </span>
              {quizzes.map((q) => {
                const qDocId = String(q.documentId || q.id);
                const pastResult = quizResults.find(
                  (r) =>
                    r.quiz?.documentId === qDocId ||
                    String(r.quiz?.id) === qDocId
                );

                return (
                  <Link
                    key={qDocId}
                    href={`/courses/${courseDocId}/quizzes/${qDocId}`}
                    className="flex items-center justify-between gap-3 rounded-xl p-3 text-xs transition-all hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold",
                          pastResult
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                        )}
                      >
                        {pastResult ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Layers className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <span className="truncate font-medium">{q.title}</span>
                    </div>

                    {pastResult ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                      >
                        {pastResult.score}/{pastResult.totalQuestions}
                      </Badge>
                    ) : (
                      <Award className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
