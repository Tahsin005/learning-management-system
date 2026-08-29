"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useInstructorCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/hooks/queries/use-course-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import type { CourseFormValues } from "@/lib/validations/course";

export function useInstructorOverview() {
  const { user, role, roleType, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: coursesData, isLoading: isCoursesLoading } = useInstructorCoursesQuery(
    user?.id,
    { page, pageSize: 6, search: activeSearch },
    isAuthenticated
  );

  const { data: enrollmentsData } = useMyEnrollmentsQuery(1, 100, isAuthenticated);

  const createCourseMutation = useCreateCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation();
  const deleteCourseMutation = useDeleteCourseMutation();

  const courses = coursesData?.data || [];
  const pagination = coursesData?.meta?.pagination || {
    page: 1,
    pageSize: 6,
    pageCount: 1,
    total: 0,
  };

  const enrollments = enrollmentsData?.data || [];
  const completedEnrollmentsCount = enrollments.filter((e) => e.isCompleted).length;
  const totalQuizzesCount = courses.reduce((acc, c) => acc + (c.quizzes?.length || 0), 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(search);
    setPage(1);
  };

  const createCourse = (values: CourseFormValues, onSuccess?: () => void) => {
    createCourseMutation.mutate(values, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const updateCourse = (documentId: string, values: CourseFormValues, onSuccess?: () => void) => {
    updateCourseMutation.mutate(
      {
        documentId,
        data: values,
      },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const deleteCourse = (documentId: string, onSuccess?: () => void) => {
    deleteCourseMutation.mutate(documentId, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const getCourseEnrollmentCount = (courseId: string | number) => {
    return enrollments.filter(
      (e) =>
        e.course?.documentId === String(courseId) ||
        String(e.course?.id) === String(courseId)
    ).length;
  };

  return {
    user,
    role,
    roleType,
    courses,
    pagination,
    totalCourses: pagination.total,
    totalEnrollments: enrollments.length,
    completedEnrollments: completedEnrollmentsCount,
    totalQuizzes: totalQuizzesCount,
    isLoading: isCoursesLoading,

    page,
    setPage,
    search,
    setSearch,
    activeSearch,
    handleSearchSubmit,

    getCourseEnrollmentCount,

    createCourse,
    updateCourse,
    deleteCourse,
    isCreatingCourse: createCourseMutation.isPending,
    isUpdatingCourse: updateCourseMutation.isPending,
    isDeletingCourse: deleteCourseMutation.isPending,
  };
}
