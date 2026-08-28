"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizzesApi } from "@/lib/api/quizzes";
import type {
  Quiz,
  QuizResultRecord,
  QuizSubmissionPayload,
  QuizSubmissionResponse,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/types/course";
import { toast } from "sonner";

export const QUIZ_QUERY_KEYS = {
  all: ["quizzes"] as const,
  detail: (documentId: string) => ["quizzes", "detail", documentId] as const,
  byCourse: (courseDocId: string) => ["quizzes", "course", courseDocId] as const,
  myResults: (page: number, pageSize: number) => ["quiz-results", "my", page, pageSize] as const,
  resultDetail: (documentId: string) => ["quiz-results", "detail", documentId] as const,
};

export function useQuizQuery(documentId: string, enabled = true) {
  return useQuery<StrapiSingleResponse<Quiz>, Error>({
    queryKey: QUIZ_QUERY_KEYS.detail(documentId),
    queryFn: () => quizzesApi.getQuiz(documentId),
    enabled: !!documentId && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useQuizzesByCourseQuery(courseDocId: string, enabled = true) {
  return useQuery<StrapiListResponse<Quiz>, Error>({
    queryKey: QUIZ_QUERY_KEYS.byCourse(courseDocId),
    queryFn: () => quizzesApi.getQuizzesByCourse(courseDocId),
    enabled: !!courseDocId && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyQuizResultsQuery(page = 1, pageSize = 25, enabled = true) {
  return useQuery<StrapiListResponse<QuizResultRecord>, Error>({
    queryKey: QUIZ_QUERY_KEYS.myResults(page, pageSize),
    queryFn: () => quizzesApi.getMyQuizResults(page, pageSize),
    enabled,
    staleTime: 1000 * 5,
  });
}

export function useSubmitQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation<QuizSubmissionResponse, Error, QuizSubmissionPayload>({
    mutationFn: (payload) => quizzesApi.submitQuiz(payload),
    onSuccess: (data) => {
      toast.success(data.message || `Quiz graded! You scored ${data.score}/${data.totalQuestions} (${data.percentage}%)`);
      queryClient.invalidateQueries({ queryKey: ["quiz-results"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit quiz.");
    },
  });
}
