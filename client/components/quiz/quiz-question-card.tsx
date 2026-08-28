"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuizQuestion, QuizAnswerResult } from "@/types/course";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  qIdx: number;
  totalQuestions: number;
  selectedOptionIndex?: number | null;
  resultDetail?: QuizAnswerResult;
  isSubmitted: boolean;
  onSelectOption: (questionIndex: number, optionIndex: number) => void;
}

export function QuizQuestionCard({
  question,
  qIdx,
  totalQuestions,
  selectedOptionIndex,
  resultDetail,
  isSubmitted,
  onSelectOption,
}: QuizQuestionCardProps) {
  const isCorrect = resultDetail?.isCorrect;

  return (
    <Card
      id={`quiz-question-${qIdx + 1}`}
      className={cn(
        "border bg-card shadow-sm transition-all duration-200 scroll-mt-24",
        isSubmitted
          ? isCorrect
            ? "border-emerald-500/40 bg-emerald-500/[0.03]"
            : "border-destructive/40 bg-destructive/[0.03]"
          : selectedOptionIndex !== undefined
          ? "border-primary/40"
          : "border-border/80"
      )}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Question {qIdx + 1} of {totalQuestions}
          </span>
          {isSubmitted && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-semibold flex items-center gap-1 py-0.5",
                isCorrect
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-destructive/10 text-destructive border-destructive/30"
              )}
            >
              {isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              <span>{isCorrect ? "Correct" : "Incorrect"}</span>
            </Badge>
          )}
        </div>

        <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {question.questionText}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {question.options.map((optionText, optIdx) => {
          const isSelected = selectedOptionIndex === optIdx;
          const isAnswerCorrectKey = resultDetail && resultDetail.correctAnswerIndex === optIdx;
          const isStudentWrongChoice = resultDetail && !isCorrect && isSelected;

          return (
            <button
              type="button"
              key={optIdx}
              disabled={isSubmitted}
              onClick={() => onSelectOption(qIdx, optIdx)}
              className={cn(
                "w-full text-left flex items-center justify-between rounded-xl border p-3.5 text-xs sm:text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !isSubmitted && (isSelected
                  ? "border-primary bg-primary/10 text-foreground font-semibold shadow-sm cursor-pointer"
                  : "border-border/70 bg-muted/20 hover:border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground cursor-pointer"),
                isSubmitted && (isAnswerCorrectKey
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold"
                  : isStudentWrongChoice
                  ? "border-destructive bg-destructive/15 text-destructive font-semibold"
                  : "border-border/40 bg-muted/10 opacity-50 cursor-default")
              )}
            >
              <div className="flex items-center gap-3 pr-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                    !isSubmitted && (isSelected ? "border-primary bg-primary text-white" : "border-border/80 bg-card text-muted-foreground"),
                    isSubmitted && (isAnswerCorrectKey ? "border-emerald-500 bg-emerald-500 text-white" : isStudentWrongChoice ? "border-destructive bg-destructive text-white" : "border-border/40")
                  )}
                >
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span>{optionText}</span>
              </div>

              {isSubmitted && isAnswerCorrectKey && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 ml-2" />
              )}
              {isSubmitted && isStudentWrongChoice && (
                <XCircle className="h-4 w-4 shrink-0 text-destructive ml-2" />
              )}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
