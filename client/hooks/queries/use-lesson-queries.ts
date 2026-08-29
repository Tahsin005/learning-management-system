"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  lessonsApi,
  type UpdateLessonProgressResponse,
  type CreateLessonInput,
  type UpdateLessonInput,
} from "@/lib/api/lessons";
import type { Lesson, LessonProgress, StrapiListResponse, StrapiSingleResponse } from "@/types/course";
import { toast } from "sonner";
import { COURSE_QUERY_KEYS } from "./use-course-queries";

export const LESSON_QUERY_KEYS = {
  all: ["lessons"] as const,
  detail: (documentId: string) => ["lessons", "detail", documentId] as const,
  byCourse: (courseDocId: string) => ["lessons", "course", courseDocId] as const,
  myProgresses: ["lesson-progresses"] as const,
};

export function useLessonQuery(documentId: string, enabled = true) {
  return useQuery<StrapiSingleResponse<Lesson>, Error>({
    queryKey: LESSON_QUERY_KEYS.detail(documentId),
    queryFn: () => lessonsApi.getLesson(documentId),
    enabled: !!documentId && enabled,
    staleTime: 1000 * 5,
  });
}

export function useLessonsByCourseQuery(courseDocId: string, enabled = true) {
  return useQuery<StrapiListResponse<Lesson>, Error>({
    queryKey: LESSON_QUERY_KEYS.byCourse(courseDocId),
    queryFn: () => lessonsApi.getLessonsByCourse(courseDocId),
    enabled: !!courseDocId && enabled,
    staleTime: 1000 * 5,
  });
}

export function useMyLessonProgressesQuery(enabled = true) {
  return useQuery<StrapiListResponse<LessonProgress>, Error>({
    queryKey: LESSON_QUERY_KEYS.myProgresses,
    queryFn: () => lessonsApi.getMyProgresses(),
    enabled,
    staleTime: 1000 * 5,
  });
}

export function useCreateLessonMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<StrapiSingleResponse<Lesson>, Error, CreateLessonInput>({
    mutationFn: (data) => lessonsApi.createLesson(data),
    onSuccess: (res) => {
      toast.success(`Lesson "${res.data.title}" added to course!`);
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-results"] });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.byCourse(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.progress(courseDocId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create lesson.");
    },
  });
}

export function useUpdateLessonMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<StrapiSingleResponse<Lesson>, Error, { documentId: string; data: UpdateLessonInput }>({
    mutationFn: ({ documentId, data }) => lessonsApi.updateLesson(documentId, data),
    onSuccess: (res, variables) => {
      toast.success(`Lesson "${res.data.title}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.detail(variables.documentId) });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-results"] });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.byCourse(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.progress(courseDocId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update lesson.");
    },
  });
}

export function useDeleteLessonMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<{ data: Lesson }, Error, string>({
    mutationFn: (documentId) => lessonsApi.deleteLesson(documentId),
    onSuccess: () => {
      toast.success("Lesson deleted from course.");
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-results"] });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.byCourse(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.progress(courseDocId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete lesson.");
    },
  });
}

export function useUpdateLessonProgressMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<UpdateLessonProgressResponse, Error, { lessonDocId: string; completed: boolean }>({
    mutationFn: ({ lessonDocId, completed }) => lessonsApi.updateProgress(lessonDocId, completed),
    onSuccess: (data, variables) => {
      toast.success(variables.completed ? "Lesson marked as complete!" : "Lesson progress updated.");
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.myProgresses });
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.detail(variables.lessonDocId) });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.progress(courseDocId) });
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
      } else {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update lesson progress.");
    },
  });
}
