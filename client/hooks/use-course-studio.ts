"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  useCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/hooks/queries/use-course-queries";
import {
  useLessonsByCourseQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from "@/hooks/queries/use-lesson-queries";
import {
  useQuizzesByCourseQuery,
  useCourseQuizResultsQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} from "@/hooks/queries/use-quiz-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import type { QuizQuestion } from "@/types/course";
import type { CourseFormValues, LessonFormValues } from "@/lib/validations/course";

export function useCourseStudio(courseDocId: string) {
  const router = useRouter();
  const { user, roleType, isAuthenticated } = useAuth();

  const { data: courseData, isLoading: isCourseLoading, isError } = useCourseQuery(courseDocId);
  const { data: lessonsData, isLoading: isLessonsLoading } = useLessonsByCourseQuery(courseDocId);
  const { data: quizzesData, isLoading: isQuizzesLoading } = useQuizzesByCourseQuery(courseDocId);
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useMyEnrollmentsQuery(
    1,
    100,
    isAuthenticated,
    courseDocId
  );
  const { data: quizResultsData } = useCourseQuizResultsQuery(courseDocId, 1, 100, isAuthenticated);

  const createLessonMutation = useCreateLessonMutation(courseDocId);
  const updateLessonMutation = useUpdateLessonMutation(courseDocId);
  const deleteLessonMutation = useDeleteLessonMutation(courseDocId);

  const createQuizMutation = useCreateQuizMutation(courseDocId);
  const updateQuizMutation = useUpdateQuizMutation(courseDocId);
  const deleteQuizMutation = useDeleteQuizMutation(courseDocId);

  const updateCourseMutation = useUpdateCourseMutation(courseDocId);
  const deleteCourseMutation = useDeleteCourseMutation();

  const course = courseData?.data;
  const lessons = lessonsData?.data || course?.lessons || [];
  const quizzes = quizzesData?.data || course?.quizzes || [];

  const courseEnrollments = (enrollmentsData?.data || []).filter(
    (e) =>
      e.course?.documentId === courseDocId ||
      String(e.course?.id) === String(courseDocId)
  );

  const isOwner = course?.owner?.id === user?.id || roleType === "admin";

  const createLesson = (values: LessonFormValues, onSuccess?: () => void) => {
    createLessonMutation.mutate(
      {
        title: values.title,
        content: values.content,
        videoUrl: values.videoUrl || null,
        course: courseDocId,
        order: lessons.length + 1,
      },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const updateLesson = (documentId: string, values: LessonFormValues, onSuccess?: () => void) => {
    updateLessonMutation.mutate(
      {
        documentId,
        data: {
          title: values.title,
          content: values.content,
          videoUrl: values.videoUrl || null,
        },
      },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const deleteLesson = (documentId: string, onSuccess?: () => void) => {
    deleteLessonMutation.mutate(documentId, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const createQuiz = (
    values: { title: string; questions: Omit<QuizQuestion, "id">[] },
    onSuccess?: () => void
  ) => {
    createQuizMutation.mutate(
      {
        title: values.title,
        course: courseDocId,
        questions: values.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex ?? 0,
        })),
      },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const updateQuiz = (
    documentId: string,
    values: { title: string; questions?: Omit<QuizQuestion, "id">[] },
    onSuccess?: () => void
  ) => {
    const existing = quizzes.find(
      (q) => String(q.documentId || q.id) === String(documentId)
    );

    const updatePayload: { title?: string; questions?: { questionText: string; options: string[]; correctAnswerIndex: number }[] } = {
      title: values.title,
    };

    if (values.questions) {
      const existingClean = (existing?.questions || []).map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex ?? 0,
      }));
      const incomingClean = values.questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex ?? 0,
      }));

      if (JSON.stringify(existingClean) !== JSON.stringify(incomingClean)) {
        updatePayload.questions = incomingClean;
      }
    }

    updateQuizMutation.mutate(
      {
        documentId,
        data: updatePayload,
      },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const deleteQuiz = (documentId: string, onSuccess?: () => void) => {
    deleteQuizMutation.mutate(documentId, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const updateCourse = (values: CourseFormValues, onSuccess?: () => void) => {
    updateCourseMutation.mutate(
      {
        documentId: courseDocId,
        data: values,
      },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const deleteCourse = (onSuccess?: () => void) => {
    deleteCourseMutation.mutate(courseDocId, {
      onSuccess: () => {
        onSuccess?.();
        router.push("/instructor");
      },
    });
  };

  return {
    course,
    lessons,
    quizzes,
    courseEnrollments,
    quizResults: quizResultsData?.data || [],
    isOwner,
    user,
    roleType,

    isLoading: isCourseLoading,
    isLessonsLoading,
    isQuizzesLoading,
    isEnrollmentsLoading,
    isError,

    createLesson,
    updateLesson,
    deleteLesson,
    isCreatingLesson: createLessonMutation.isPending,
    isUpdatingLesson: updateLessonMutation.isPending,
    isDeletingLesson: deleteLessonMutation.isPending,

    createQuiz,
    updateQuiz,
    deleteQuiz,
    isCreatingQuiz: createQuizMutation.isPending,
    isUpdatingQuiz: updateQuizMutation.isPending,
    isDeletingQuiz: deleteQuizMutation.isPending,

    updateCourse,
    deleteCourse,
    isUpdatingCourse: updateCourseMutation.isPending,
    isDeletingCourse: deleteCourseMutation.isPending,
  };
}
