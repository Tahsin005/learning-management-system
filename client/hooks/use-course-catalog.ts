"use client";

import { useState } from "react";
import { useCoursesQuery } from "@/hooks/queries/use-course-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import { useAuth } from "@/hooks/use-auth";

export function useCourseCatalog(pageSize = 9) {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading, isError, error } = useCoursesQuery({
    page,
    pageSize,
    search: activeSearch,
  });

  const { data: enrollmentsData } = useMyEnrollmentsQuery(1, 100, isAuthenticated);

  const courses = data?.data || [];
  const enrollments = enrollmentsData?.data || [];
  const enrolledCourseIds = new Set(
    enrollments.map((e) => e.course?.documentId || String(e.course?.id))
  );

  const pagination = data?.meta?.pagination || {
    page: 1,
    pageSize,
    pageCount: 1,
    total: 0,
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(search);
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setActiveSearch("");
    setPage(1);
  };

  return {
    courses,
    pagination,
    total: pagination.total,
    enrolledCourseIds,
    isLoading,
    isError,
    error,

    page,
    setPage,
    search,
    setSearch,
    activeSearch,
    handleSearchSubmit,
    clearSearch,
  };
}
