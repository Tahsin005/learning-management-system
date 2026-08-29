"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  quizzesApi,
  type CreateQuizInput,
  type UpdateQuizInput,
} from "@/lib/api/quizzes";
import type {
  Quiz,
  QuizResultRecord,
  QuizSubmissionPayload,
  QuizSubmissionResponse,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/types/course";
import { toast } from "sonner";
import { COURSE_QUERY_KEYS } from "./use-course-queries";

export const QUIZ_QUERY_KEYS = {
  all: ["quizzes"] as const,
  detail: (documentId: string) => ["quizzes", "detail", documentId] as const,
  byCourse: (courseDocId: string) => ["quizzes", "course", courseDocId] as const,
  myResults: (page: number, pageSize: number) => ["quiz-results", "my", page, pageSize] as const,
  courseResults: (courseDocId?: string, page = 1, pageSize = 100) =>
    ["quiz-results", "course", courseDocId || "all", page, pageSize] as const,
  resultDetail: (documentId: string) => ["quiz-results", "detail", documentId] as const,
};

export function useQuizQuery(documentId: string, enabled = true) {
  return useQuery<StrapiSingleResponse<Quiz>, Error>({
    queryKey: QUIZ_QUERY_KEYS.detail(documentId),
    queryFn: () => quizzesApi.getQuiz(documentId),
    enabled: !!documentId && enabled,
    staleTime: 1000 * 5,
  });
}

export function useQuizzesByCourseQuery(courseDocId: string, enabled = true) {
  return useQuery<StrapiListResponse<Quiz>, Error>({
    queryKey: QUIZ_QUERY_KEYS.byCourse(courseDocId),
    queryFn: () => quizzesApi.getQuizzesByCourse(courseDocId),
    enabled: !!courseDocId && enabled,
    staleTime: 1000 * 5,
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

export function useCourseQuizResultsQuery(
  courseDocId?: string,
  page = 1,
  pageSize = 100,
  enabled = true
) {
  return useQuery<StrapiListResponse<QuizResultRecord>, Error>({
    queryKey: QUIZ_QUERY_KEYS.courseResults(courseDocId, page, pageSize),
    queryFn: () => quizzesApi.getCourseQuizResults(courseDocId, page, pageSize),
    enabled,
    staleTime: 1000 * 5,
  });
}

export function useCreateQuizMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<StrapiSingleResponse<Quiz>, Error, CreateQuizInput>({
    mutationFn: (data) => quizzesApi.createQuiz(data),
    onSuccess: (res) => {
      toast.success(`Assessment "${res.data.title}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-results"] });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.byCourse(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create assessment quiz.");
    },
  });
}

export function useUpdateQuizMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<StrapiSingleResponse<Quiz>, Error, { documentId: string; data: UpdateQuizInput }>({
    mutationFn: ({ documentId, data }) => quizzesApi.updateQuiz(documentId, data),
    onSuccess: (res, variables) => {
      toast.success(`Assessment "${res.data.title}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.detail(variables.documentId) });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-results"] });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.byCourse(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update assessment.");
    },
  });
}

export function useDeleteQuizMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<{ data: Quiz }, Error, string>({
    mutationFn: (documentId) => quizzesApi.deleteQuiz(documentId),
    onSuccess: () => {
      toast.success("Assessment quiz deleted from course.");
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-results"] });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.byCourse(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete assessment quiz.");
    },
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
