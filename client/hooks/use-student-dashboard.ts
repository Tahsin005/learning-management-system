"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import { useMyQuizResultsQuery } from "@/hooks/queries/use-quiz-queries";
import type { QuizResultRecord } from "@/types/course";
import type { ChangePasswordFormValues } from "@/lib/validations/auth";

export function useStudentDashboard() {
  const {
    user,
    role,
    roleType,
    isAuthenticated,
    changePassword: authChangePassword,
    isChangingPassword,
    isLoggingOut,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "quizzes" | "security">("overview");
  const [coursesPage, setCoursesPage] = useState(1);
  const [quizzesPage, setQuizzesPage] = useState(1);
  const [selectedQuizResult, setSelectedQuizResult] = useState<QuizResultRecord | null>(null);

  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useMyEnrollmentsQuery(
    coursesPage,
    3,
    isAuthenticated
  );

  const { data: quizResultsData, isLoading: isQuizResultsLoading } = useMyQuizResultsQuery(
    quizzesPage,
    5,
    isAuthenticated
  );

  const rawEnrollments = enrollmentsData?.data || [];
  const enrollments = rawEnrollments.filter((e) => e.course !== null && e.course !== undefined);

  const enrollmentsPagination = enrollmentsData?.meta?.pagination || {
    page: 1,
    pageSize: 3,
    pageCount: 1,
    total: enrollments.length,
  };

  const rawQuizResults = quizResultsData?.data || [];
  const quizResults = rawQuizResults.filter((r) => r.quiz !== null && r.quiz !== undefined);

  const quizPagination = quizResultsData?.meta?.pagination || {
    page: 1,
    pageSize: 5,
    pageCount: 1,
    total: quizResults.length,
  };

  const changePassword = async (values: ChangePasswordFormValues) => {
    await authChangePassword(values);
  };

  return {
    user,
    role,
    roleType,
    isAuthenticated,
    isLoggingOut,

    activeTab,
    setActiveTab,

    coursesPage,
    setCoursesPage,
    quizzesPage,
    setQuizzesPage,

    selectedQuizResult,
    setSelectedQuizResult,

    enrollments,
    enrollmentsPagination,
    isEnrollmentsLoading,

    quizResults,
    quizPagination,
    isQuizResultsLoading,

    changePassword,
    isChangingPassword,
  };
}
