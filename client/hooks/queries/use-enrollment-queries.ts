"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollmentsApi, type EnrollCourseResponse } from "@/lib/api/enrollments";
import type { Enrollment, StrapiListResponse } from "@/types/course";
import { toast } from "sonner";
import { COURSE_QUERY_KEYS } from "./use-course-queries";

export const ENROLLMENT_QUERY_KEYS = {
  all: ["enrollments"] as const,
  myList: (page: number, pageSize: number, courseDocId?: string) =>
    ["enrollments", "my", page, pageSize, courseDocId || "all"] as const,
};

export function useMyEnrollmentsQuery(page = 1, pageSize = 25, enabled = true, courseDocId?: string) {
  return useQuery<StrapiListResponse<Enrollment>, Error>({
    queryKey: ENROLLMENT_QUERY_KEYS.myList(page, pageSize, courseDocId),
    queryFn: () => enrollmentsApi.getMyEnrollments(page, pageSize, courseDocId),
    enabled,
    staleTime: 1000 * 5,
  });
}

export function useEnrollMutation() {
  const queryClient = useQueryClient();

  return useMutation<EnrollCourseResponse, Error, string>({
    mutationFn: (courseDocId: string) => enrollmentsApi.enroll(courseDocId),
    onSuccess: (data, courseDocId) => {
      toast.success(data.message || "Successfully enrolled in course!");
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseDocId) });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.progress(courseDocId) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to enroll in course.");
    },
  });
}
