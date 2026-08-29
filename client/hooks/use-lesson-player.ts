"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCourseQuery, useCourseProgressQuery } from "@/hooks/queries/use-course-queries";
import { useLessonQuery, useUpdateLessonProgressMutation } from "@/hooks/queries/use-lesson-queries";
import { useEnrollMutation } from "@/hooks/queries/use-enrollment-queries";
import { useMyQuizResultsQuery } from "@/hooks/queries/use-quiz-queries";

export function useLessonPlayer(courseDocId: string, lessonDocId: string) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: courseData, isLoading: isCourseLoading } = useCourseQuery(courseDocId);
  const { data: lessonData, isLoading: isLessonLoading, isError: isLessonError } = useLessonQuery(lessonDocId);
  const { data: progressData } = useCourseProgressQuery(courseDocId, isAuthenticated);
  const { data: myQuizResultsData } = useMyQuizResultsQuery(1, 100, isAuthenticated);

  const updateProgressMutation = useUpdateLessonProgressMutation(courseDocId);
  const enrollMutation = useEnrollMutation();

  const course = courseData?.data;
  const lesson = lessonData?.data;
  const lessons = course?.lessons || [];
  const quizzes = course?.quizzes || [];

  const completedLessonIds = (progressData?.completedLessonIds || []).map(String);
  const isCurrentCompleted = completedLessonIds.includes(String(lesson?.documentId || lessonDocId));

  const currentIndex = lessons.findIndex(
    (l) => String(l.documentId || l.id) === String(lessonDocId)
  );
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const firstQuiz = quizzes[0];

  const firstQuizResult = firstQuiz
    ? myQuizResultsData?.data?.find(
        (r) =>
          r.quiz?.documentId === String(firstQuiz.documentId || firstQuiz.id) ||
          String(r.quiz?.id) === String(firstQuiz.documentId || firstQuiz.id)
      )
    : null;

  const toggleComplete = (onSuccess?: () => void) => {
    updateProgressMutation.mutate(
      {
        lessonDocId,
        completed: !isCurrentCompleted,
      },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const enroll = (onSuccess?: () => void) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseDocId}/lessons/${lessonDocId}`);
      return;
    }
    enrollMutation.mutate(courseDocId, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return {
    course,
    lesson,
    lessons,
    quizzes,
    completedLessonIds,
    isCurrentCompleted,
    currentIndex,
    prevLesson,
    nextLesson,
    firstQuiz,
    firstQuizResult,
    myQuizResults: myQuizResultsData?.data || [],

    isAuthenticated,
    isLoading: isCourseLoading || isLessonLoading,
    isLessonError,

    toggleComplete,
    enroll,
    isUpdatingProgress: updateProgressMutation.isPending,
    isEnrolling: enrollMutation.isPending,
  };
}
