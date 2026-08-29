"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCourseQuery } from "@/hooks/queries/use-course-queries";
import { useQuizQuery, useSubmitQuizMutation, useMyQuizResultsQuery } from "@/hooks/queries/use-quiz-queries";
import type { QuizSubmissionResponse, QuizQuestion } from "@/types/course";

export function useQuizRunner(courseDocId: string, quizDocId: string) {
  const { isAuthenticated } = useAuth();
  const { data: courseData, isLoading: isCourseLoading } = useCourseQuery(courseDocId);
  const { data: quizData, isLoading: isQuizLoading, isError, error } = useQuizQuery(quizDocId);
  const { data: myResultsData, isLoading: isResultsLoading } = useMyQuizResultsQuery(1, 100, isAuthenticated);
  const submitQuizMutation = useSubmitQuizMutation();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [justSubmittedResult, setJustSubmittedResult] = useState<QuizSubmissionResponse | null>(null);

  const course = courseData?.data;
  const quiz = quizData?.data;
  const questions = quiz?.questions || [];

  const existingResultRecord = myResultsData?.data?.find(
    (r) =>
      r.quiz?.documentId === quizDocId ||
      String(r.quiz?.id) === String(quizDocId)
  );

  const activeResult: QuizSubmissionResponse | null =
    justSubmittedResult ||
    (existingResultRecord
      ? {
          message: "Assessment completed.",
          documentId: existingResultRecord.documentId,
          score: existingResultRecord.score,
          totalQuestions: existingResultRecord.totalQuestions,
          percentage:
            existingResultRecord.totalQuestions > 0
              ? Math.round((existingResultRecord.score / existingResultRecord.totalQuestions) * 100)
              : 0,
          answers: existingResultRecord.answers || [],
          submittedAt: existingResultRecord.submittedAt,
        }
      : null);

  const displayedQuestions: QuizQuestion[] = activeResult?.answers && activeResult.answers.length > 0
    ? activeResult.answers.map((ans, idx) => ({
        id: idx,
        questionText: ans.questionText,
        options: ans.options,
        correctAnswerIndex: ans.correctAnswerIndex,
      }))
    : questions;

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (activeResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const scrollToQuestion = (index: number) => {
    const el = document.getElementById(`quiz-question-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const submitQuiz = (onSuccess?: (data: QuizSubmissionResponse) => void) => {
    const formattedAnswers = questions.map((_, idx) => ({
      questionIndex: idx,
      selectedOptionIndex: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1,
    }));

    submitQuizMutation.mutate(
      {
        quizId: quizDocId,
        answers: formattedAnswers,
      },
      {
        onSuccess: (data) => {
          setJustSubmittedResult(data);
          window.scrollTo({ top: 0, behavior: "smooth" });
          onSuccess?.(data);
        },
      }
    );
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return {
    course,
    quiz,
    questions,
    displayedQuestions,
    activeResult,
    selectedAnswers,
    answeredCount,
    isAllAnswered,
    progressPct,

    isLoading: isCourseLoading || isQuizLoading || isResultsLoading,
    isError,
    error,

    handleSelectOption,
    scrollToQuestion,
    submitQuiz,
    isSubmitting: submitQuizMutation.isPending,
  };
}
