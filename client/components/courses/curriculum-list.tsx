"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, PlayCircle, Lock, Layers, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Course, QuizResultRecord } from "@/types/course";

interface CurriculumListProps {
  course: Course;
  isEnrolled: boolean;
  completedLessonIds: string[];
  quizResults: QuizResultRecord[];
  onEnroll: () => void;
}

export function CurriculumList({
  course,
  isEnrolled,
  completedLessonIds,
  quizResults,
  onEnroll,
}: CurriculumListProps) {
  const courseDocId = course.documentId || course.id;
  const lessons = course.lessons || [];
  const quizzes = course.quizzes || [];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Course Curriculum</span>
          </h2>
          <span className="text-xs text-muted-foreground">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} • {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
          </span>
        </div>

        {lessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
            No lessons published yet for this course.
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const lessonDocId = lesson.documentId || lesson.id;
              const isCompleted = completedLessonIds.includes(String(lessonDocId));

              return (
                <div
                  key={lessonDocId}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all",
                    isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                      : "border-border/80 bg-card hover:border-primary/40 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs border",
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-muted text-muted-foreground border-border/60"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm text-foreground">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Lesson #{idx + 1}
                      </p>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Link
                      href={`/courses/${courseDocId}/lessons/${lessonDocId}`}
                      className={cn(
                        buttonVariants({ size: "sm", variant: "ghost" }),
                        "gap-1.5 text-xs font-semibold self-start sm:self-auto border border-border/60 hover:border-primary/50"
                      )}
                    >
                      <PlayCircle className="h-3.5 w-3.5 text-primary" />
                      <span>{isCompleted ? "Rewatch" : "Watch Lesson"}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={onEnroll}
                      className={cn(
                        buttonVariants({ size: "sm", variant: "ghost" }),
                        "gap-1.5 text-xs font-medium text-muted-foreground self-start sm:self-auto opacity-70 cursor-pointer"
                      )}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Enroll to Unlock</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {quizzes.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Course Assessments</span>
            </h2>
            <span className="text-xs text-muted-foreground">
              {quizzes.length} Graded {quizzes.length === 1 ? "Quiz" : "Quizzes"}
            </span>
          </div>

          <div className="space-y-3">
            {quizzes.map((quiz) => {
              const quizDocId = quiz.documentId || quiz.id;
              const pastResult = quizResults.find(
                (r) =>
                  r.quiz?.documentId === String(quizDocId) ||
                  String(r.quiz?.id) === String(quizDocId)
              );
              const isQuizSubmitted = !!pastResult;

              return (
                <div
                  key={quizDocId}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all",
                    isQuizSubmitted
                      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                      : "border-border/80 bg-card hover:border-indigo-500/40 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs border",
                        isQuizSubmitted
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                      )}
                    >
                      {isQuizSubmitted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Award className="h-4 w-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm text-foreground">
                          {quiz.title}
                        </p>
                        {isQuizSubmitted && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold"
                          >
                            Score: {pastResult.score}/{pastResult.totalQuestions}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {quiz.questions?.length || 0} Multiple-Choice Questions • Graded
                      </p>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Link
                      href={`/courses/${courseDocId}/quizzes/${quizDocId}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "gap-1.5 text-xs font-semibold self-start sm:self-auto",
                        isQuizSubmitted
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-primary text-white shadow-sm"
                      )}
                    >
                      {isQuizSubmitted ? (
                        <>
                          <Award className="h-3.5 w-3.5" />
                          <span>View Result</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-3.5 w-3.5" />
                          <span>Take Quiz</span>
                        </>
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={onEnroll}
                      className={cn(
                        buttonVariants({ size: "sm", variant: "ghost" }),
                        "gap-1.5 text-xs font-medium text-muted-foreground self-start sm:self-auto opacity-70 cursor-pointer"
                      )}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Enroll to Unlock</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
