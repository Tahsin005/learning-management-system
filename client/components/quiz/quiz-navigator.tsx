"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuizQuestion, QuizSubmissionResponse } from "@/types/course";

interface QuizNavigatorProps {
  questions: QuizQuestion[];
  selectedAnswers: Record<number, number>;
  activeResult: QuizSubmissionResponse | null;
  onScrollToQuestion: (index: number) => void;
}

export function QuizNavigator({
  questions,
  selectedAnswers,
  activeResult,
  onScrollToQuestion,
}: QuizNavigatorProps) {
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground">
            Question Navigator
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {activeResult
              ? `${activeResult.score}/${activeResult.totalQuestions} Correct`
              : `${answeredCount}/${questions.length} Answered`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, qIdx) => {
            const isAnswered = selectedAnswers[qIdx] !== undefined;
            const resultDetail = activeResult?.answers?.[qIdx];
            const isCorrect = resultDetail?.isCorrect;

            return (
              <button
                type="button"
                key={qIdx}
                onClick={() => onScrollToQuestion(qIdx + 1)}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                  activeResult
                    ? isCorrect
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                      : "border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25"
                    : isAnswered
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                title={`Go to Question ${qIdx + 1}`}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
