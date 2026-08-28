"use client";

import { useQuery } from "@tanstack/react-query";
import { coursesApi, type GetCoursesParams } from "@/lib/api/courses";
import type { Course, CourseProgressSummary, StrapiListResponse, StrapiSingleResponse } from "@/types/course";

export const COURSE_QUERY_KEYS = {
  all: ["courses"] as const,
  list: (params: GetCoursesParams) => ["courses", "list", params] as const,
  detail: (documentId: string) => ["courses", "detail", documentId] as const,
  progress: (documentId: string) => ["courses", "progress", documentId] as const,
};

export function useCoursesQuery(params: GetCoursesParams = {}) {
  return useQuery<StrapiListResponse<Course>, Error>({
    queryKey: COURSE_QUERY_KEYS.list(params),
    queryFn: () => coursesApi.getCourses(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCourseQuery(documentId: string, enabled = true) {
  return useQuery<StrapiSingleResponse<Course>, Error>({
    queryKey: COURSE_QUERY_KEYS.detail(documentId),
    queryFn: () => coursesApi.getCourse(documentId),
    enabled: !!documentId && enabled,
    staleTime: 1000 * 60 * 2,
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
