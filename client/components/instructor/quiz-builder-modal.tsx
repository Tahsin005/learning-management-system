"use client";

import { useState } from "react";
import { PlusCircle, Trash2, CheckCircle2, Loader2, Save, HelpCircle, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Quiz, QuizQuestion } from "@/types/course";

interface QuizBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, questions: Omit<QuizQuestion, "id">[]) => Promise<void>;
  quiz?: Quiz | null;
  isLoading: boolean;
}

interface QuestionDraft {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

const emptyQuestion: QuestionDraft = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
};

function QuizBuilderForm({
  quiz,
  onSubmit,
  onClose,
  isLoading,
}: {
  quiz?: Quiz | null;
  onSubmit: (title: string, questions: Omit<QuizQuestion, "id">[]) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}) {
  const isEditing = !!quiz;

  const [title, setTitle] = useState(quiz?.title || "");
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    quiz?.questions && quiz.questions.length > 0
      ? quiz.questions.map((q) => ({
          questionText: q.questionText || "",
          options: q.options && q.options.length >= 2 ? [...q.options] : ["", "", "", ""],
          correctAnswerIndex: q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : 0,
        }))
      : [{ ...emptyQuestion }]
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, { ...emptyQuestion, options: ["", "", "", ""] }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, questionText: text } : q))
    );
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        const newOptions = [...q.options];
        newOptions[optIndex] = text;
        return { ...q, options: newOptions };
      })
    );
  };

  const handleCorrectAnswerChange = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === qIndex ? { ...q, correctAnswerIndex: optIndex } : q))
    );
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        if (q.options.length >= 5) return q;
        return { ...q, options: [...q.options, ""] };
      })
    );
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        if (q.options.length <= 2) return q;
        const newOptions = q.options.filter((_, oIdx) => oIdx !== optIndex);
        const newCorrect =
          q.correctAnswerIndex >= newOptions.length
            ? newOptions.length - 1
            : q.correctAnswerIndex;
        return { ...q, options: newOptions, correctAnswerIndex: newCorrect };
      })
    );
  };

  const handleSave = async () => {
    if (!title.trim() || title.trim().length < 3) {
      setValidationError("Quiz title must be at least 3 characters.");
      return;
    }

    if (questions.length === 0) {
      setValidationError("Assessment must have at least 1 question.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setValidationError(`Question ${i + 1} text cannot be empty.`);
        return;
      }
      if (q.options.length < 2) {
        setValidationError(`Question ${i + 1} must have at least 2 choices.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setValidationError(`Question ${i + 1}, Choice ${String.fromCharCode(65 + j)} cannot be empty.`);
          return;
        }
      }
    }

    setValidationError(null);
    try {
      await onSubmit(
        title.trim(),
        questions.map((q) => ({
          questionText: q.questionText.trim(),
          options: q.options.map((o) => o.trim()),
          correctAnswerIndex: q.correctAnswerIndex,
        }))
      );
      onClose();
    } catch {
      // Handled by parent mutation
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {validationError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium">
          {validationError}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="quizTitle" className="text-xs font-semibold">
          Quiz Title
        </Label>
        <Input
          id="quizTitle"
          placeholder="e.g. Next.js 16 Architecture & Server Components Assessment"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="bg-muted/20 text-sm font-medium"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Questions ({questions.length})</span>
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddQuestion}
            className="gap-1.5 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Question</span>
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-primary" />
                  <span>Question #{qIdx + 1}</span>
                </span>

                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    title="Remove Question"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Question Prompt</Label>
                <Input
                  placeholder="e.g. Which of the following is true regarding React Server Components?"
                  value={q.questionText}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  disabled={isLoading}
                  className="bg-muted/20 text-sm"
                />
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Answer Options (Select the radio button to designate the correct answer)
                  </Label>
                  {q.options.length < 5 && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIdx)}
                      className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      + Add Choice
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((optText, optIdx) => {
                    const isCorrect = q.correctAnswerIndex === optIdx;

                    return (
                      <div
                        key={optIdx}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-2.5 transition-all",
                          isCorrect
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : "border-border/60 bg-muted/20"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleCorrectAnswerChange(qIdx, optIdx)}
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-all cursor-pointer",
                            isCorrect
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                              : "bg-card text-muted-foreground border-border/80 hover:border-emerald-500/40"
                          )}
                          title={isCorrect ? "Correct Answer" : "Click to mark as correct answer"}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <span>{String.fromCharCode(65 + optIdx)}</span>
                          )}
                        </button>

                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                          value={optText}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          disabled={isLoading}
                          className="h-8 text-xs border-0 bg-transparent shadow-none focus-visible:ring-1"
                        />

                        {q.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(qIdx, optIdx)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                            title="Remove Choice"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isLoading}
          className="gap-1.5 bg-primary text-white font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Assessment...</span>
            </>
          ) : isEditing ? (
            <>
              <Save className="h-4 w-4" />
              <span>Update Assessment</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Create Assessment</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}

export function QuizBuilderModal({
  isOpen,
  onClose,
  onSubmit,
  quiz,
  isLoading,
}: QuizBuilderModalProps) {
  const isEditing = !!quiz;
  const modalKey = isOpen ? (quiz ? String(quiz.documentId || quiz.id) : "new-quiz") : "closed";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">
              MCQ Assessment Builder
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Quiz Assessment" : "Build New Assessment Quiz"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure multiple-choice questions, option choices, and specify the auto-grading correct answer keys.
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <QuizBuilderForm
            key={modalKey}
            quiz={quiz}
            onSubmit={onSubmit}
            onClose={onClose}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
