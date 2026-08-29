"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  coursesApi,
  type GetCoursesParams,
  type CreateCourseInput,
  type UpdateCourseInput,
} from "@/lib/api/courses";
import type { Course, CourseProgressSummary, StrapiListResponse, StrapiSingleResponse } from "@/types/course";
import { toast } from "sonner";

export const COURSE_QUERY_KEYS = {
  all: ["courses"] as const,
  list: (params: GetCoursesParams) => ["courses", "list", params] as const,
  instructorList: (userId?: number | string, params: GetCoursesParams = {}) =>
    ["courses", "instructor", userId, params] as const,
  detail: (documentId: string) => ["courses", "detail", documentId] as const,
  progress: (documentId: string) => ["courses", "progress", documentId] as const,
};

export function useCoursesQuery(params: GetCoursesParams = {}) {
  return useQuery<StrapiListResponse<Course>, Error>({
    queryKey: COURSE_QUERY_KEYS.list(params),
    queryFn: () => coursesApi.getCourses(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useInstructorCoursesQuery(
  userId?: number | string,
  params: GetCoursesParams = {},
  enabled = true
) {
  return useQuery<StrapiListResponse<Course>, Error>({
    queryKey: COURSE_QUERY_KEYS.instructorList(userId, params),
    queryFn: () => coursesApi.getInstructorCourses(userId, params),
    enabled: enabled,
    staleTime: 1000 * 5,
  });
}

export function useCourseQuery(documentId: string, enabled = true) {
  return useQuery<StrapiSingleResponse<Course>, Error>({
    queryKey: COURSE_QUERY_KEYS.detail(documentId),
    queryFn: () => coursesApi.getCourse(documentId),
    enabled: !!documentId && enabled,
    staleTime: 1000 * 5,
  });
}

export function useCourseProgressQuery(documentId: string, enabled = true) {
  return useQuery<CourseProgressSummary, Error>({
    queryKey: COURSE_QUERY_KEYS.progress(documentId),
    queryFn: () => coursesApi.getCourseProgress(documentId),
    enabled: !!documentId && enabled,
    staleTime: 1000 * 5,
  });
}

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<StrapiSingleResponse<Course>, Error, CreateCourseInput>({
    mutationFn: (data) => coursesApi.createCourse(data),
    onSuccess: (res) => {
      toast.success(`Course "${res.data.title}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create course.");
    },
  });
}

export function useUpdateCourseMutation(courseDocId?: string) {
  const queryClient = useQueryClient();

  return useMutation<StrapiSingleResponse<Course>, Error, { documentId: string; data: UpdateCourseInput }>({
    mutationFn: ({ documentId, data }) => coursesApi.updateCourse(documentId, data),
    onSuccess: (res, variables) => {
      toast.success("Course details updated successfully!");
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(variables.documentId) });
      if (courseDocId) {
        queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update course.");
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ data: Course }, Error, string>({
    mutationFn: (documentId) => coursesApi.deleteCourse(documentId),
    onSuccess: () => {
      toast.success("Course deleted successfully.");
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete course.");
    },
  });
}
