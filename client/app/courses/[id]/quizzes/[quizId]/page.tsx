"use client";

import { use } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuizRunner } from "@/hooks/use-quiz-runner";

import { QuizHero } from "@/components/quiz/quiz-hero";
import { QuizQuestionCard } from "@/components/quiz/quiz-question-card";
import { QuizNavigator } from "@/components/quiz/quiz-navigator";
import { QuizGuidelines } from "@/components/quiz/quiz-guidelines";

interface QuizRunnerPageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export default function QuizRunnerPage({ params }: QuizRunnerPageProps) {
  const resolvedParams = use(params);
  const courseDocId = resolvedParams.id;
  const quizDocId = resolvedParams.quizId;

  const {
    course,
    quiz,
    questions,
    displayedQuestions,
    activeResult,
    selectedAnswers,
    answeredCount,
    isAllAnswered,
    progressPct,
    isLoading,
    isError,
    error,
    handleSelectOption,
    scrollToQuestion,
    submitQuiz,
    isSubmitting,
  } = useQuizRunner(courseDocId, quizDocId);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading quiz assessment...</p>
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="max-w-xl mx-auto rounded-3xl border border-border/80 bg-card/90 p-8 shadow-xl space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Quiz Inaccessible
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error?.message || "You must be enrolled in this course to take and submit this assessment."}
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href={`/courses/${courseDocId}`}
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Course
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/courses" />}>
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href={`/courses/${courseDocId}`} />}
                  className="truncate max-w-[150px] sm:max-w-xs"
                >
                  {course?.title || "Course"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground truncate max-w-[200px] sm:max-w-md">
                  {quiz.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link
            href={`/courses/${courseDocId}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-xs w-fit")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Course Syllabus</span>
          </Link>
        </div>

        <QuizHero
          quiz={quiz}
          activeResult={activeResult}
          courseDocId={courseDocId}
          questionsCount={activeResult ? activeResult.totalQuestions : questions.length}
          answeredCount={answeredCount}
          progressPct={progressPct}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-6">
              {displayedQuestions.map((question, qIdx) => (
                <QuizQuestionCard
                  key={question.id || qIdx}
                  question={question}
                  qIdx={qIdx}
                  totalQuestions={displayedQuestions.length}
                  selectedOptionIndex={
                    activeResult
                      ? activeResult.answers?.[qIdx]?.selectedOptionIndex
                      : selectedAnswers[qIdx]
                  }
                  resultDetail={activeResult?.answers?.[qIdx]}
                  isSubmitted={!!activeResult}
                  onSelectOption={handleSelectOption}
                />
              ))}
            </div>

            {!activeResult && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-md">
                <div className="text-xs text-muted-foreground text-center sm:text-left">
                  {isAllAnswered ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 className="h-4 w-4" />
                      All {questions.length} questions answered. Ready to submit!
                    </span>
                  ) : (
                    <span>
                      Please answer all questions before submitting ({answeredCount} of {questions.length} selected).
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => submitQuiz()}
                  disabled={!isAllAnswered || isSubmitting}
                  className="w-full sm:w-auto gap-2 bg-primary text-white shadow-sm font-semibold h-11 px-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Grading Assessment...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Submit for Auto-Grading</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <QuizNavigator
              questions={displayedQuestions}
              selectedAnswers={selectedAnswers}
              activeResult={activeResult}
              onScrollToQuestion={scrollToQuestion}
            />

            <QuizGuidelines
              course={course}
              courseDocId={courseDocId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
