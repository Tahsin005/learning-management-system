"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCourseQuery, useCourseProgressQuery } from "@/hooks/queries/use-course-queries";
import { useMyEnrollmentsQuery, useEnrollMutation } from "@/hooks/queries/use-enrollment-queries";
import { useMyQuizResultsQuery } from "@/hooks/queries/use-quiz-queries";

export function useCourseDetails(courseDocId: string) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: courseData, isLoading: isCourseLoading, isError, error } = useCourseQuery(courseDocId);
  const { data: enrollmentsData } = useMyEnrollmentsQuery(1, 100, isAuthenticated);
  const { data: myQuizResultsData } = useMyQuizResultsQuery(1, 100, isAuthenticated);
  const enrollMutation = useEnrollMutation();

  const course = courseData?.data;
  const enrollments = enrollmentsData?.data || [];

  const isEnrolled = enrollments.some(
    (e) =>
      e.course?.documentId === courseDocId ||
      String(e.course?.id) === String(courseDocId) ||
      (course && (e.course?.documentId === course.documentId || e.course?.id === course.id))
  );

  const { data: progressData } = useCourseProgressQuery(courseDocId, isEnrolled);

  const lessons = course?.lessons || [];
  const completedLessonIds = (progressData?.completedLessonIds || []).map(String);
  const completedCount = completedLessonIds.length;
  const progressPercent = progressData?.progressPercentage || 0;

  const firstUncompletedLesson = lessons.find(
    (l) => !completedLessonIds.includes(String(l.documentId || l.id))
  ) || lessons[0];

  const enroll = (onSuccess?: () => void) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseDocId}`);
      return;
    }
    enrollMutation.mutate(courseDocId, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return {
    course,
    isEnrolled,
    lessons,
    completedLessonIds,
    completedCount,
    progressPercent,
    firstUncompletedLesson,
    quizResults: myQuizResultsData?.data || [],

    isAuthenticated,
    isLoading: isCourseLoading,
    isError,
    error,

    enroll,
    isEnrolling: enrollMutation.isPending,
  };
}
