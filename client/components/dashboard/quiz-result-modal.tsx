"use client";

import { CheckCircle2, XCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { QuizResultRecord } from "@/types/course";

interface QuizResultModalProps {
  result: QuizResultRecord | null;
  onClose: () => void;
}

export function QuizResultModal({ result, onClose }: QuizResultModalProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const percentage =
    result && result.totalQuestions > 0
      ? Math.round((result.score / result.totalQuestions) * 100)
      : 0;
  const isPassed = percentage >= 70;

  return (
    <Dialog
      open={!!result}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {result && (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">
                  Assessment Result
                </Badge>
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
              </div>
              <DialogTitle className="text-xl font-bold">
                {result.quiz?.title || "Quiz Assessment"}
              </DialogTitle>
              <DialogDescription>
                Submitted on {formatDate(result.submittedAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between rounded-2xl bg-muted/40 border border-border/70 p-4">
              <div className="space-y-0.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Total Score
                </span>
                <p className="text-2xl font-extrabold text-foreground">
                  {result.score} / {result.totalQuestions}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Percentage
                </span>
                <p className="text-3xl font-extrabold text-primary">
                  {percentage}%
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Question Breakdown</span>
              </h3>

              {(result.answers || []).length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Detailed answer history is unavailable for this record.
                </p>
              ) : (
                <div className="space-y-4">
                  {result.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-xl border p-4 space-y-3",
                        ans.isCorrect
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-destructive/30 bg-destructive/5"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Question {idx + 1}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-semibold flex items-center gap-1",
                            ans.isCorrect
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                          )}
                        >
                          {ans.isCorrect ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Correct</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Incorrect</span>
                            </>
                          )}
                        </Badge>
                      </div>

                      <p className="text-sm font-semibold text-foreground">
                        {ans.questionText}
                      </p>

                      <div className="space-y-2 pt-1">
                        {(ans.options || []).map((optText, optIdx) => {
                          const isChosen = ans.selectedOptionIndex === optIdx;
                          const isCorrectKey = ans.correctAnswerIndex === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={cn(
                                "flex items-center justify-between rounded-lg p-2.5 text-xs border transition-all",
                                isCorrectKey
                                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-medium"
                                  : isChosen && !ans.isCorrect
                                  ? "border-destructive bg-destructive/15 text-destructive font-medium"
                                  : "border-border/40 bg-muted/20 text-muted-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                    isCorrectKey
                                      ? "bg-emerald-500 text-white"
                                      : isChosen && !ans.isCorrect
                                      ? "bg-destructive text-white"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{optText}</span>
                              </div>

                              {isCorrectKey && (
                                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Correct Answer
                                </span>
                              )}
                              {isChosen && !ans.isCorrect && (
                                <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                  <XCircle className="h-3.5 w-3.5" />
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
