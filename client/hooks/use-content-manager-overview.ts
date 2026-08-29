"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useInstructorCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/hooks/queries/use-course-queries";
import {
  useBlogPostsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/hooks/queries/use-blog-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import type { CourseFormValues } from "@/lib/validations/course";
import type { BlogFormValues } from "@/lib/validations/blog";
import type { BlogPost } from "@/types/blog";
import type { Course } from "@/types/course";

export function useContentManagerOverview() {
  const { user, role, roleType, isAuthenticated } = useAuth();

  // Active Tab: "courses" | "blogs" | "gradebook"
  const [activeTab, setActiveTab] = useState<"courses" | "blogs" | "gradebook">("courses");

  // Courses state
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesSearch, setCoursesSearch] = useState("");
  const [activeCoursesSearch, setActiveCoursesSearch] = useState("");

  // Blogs state
  const [blogsPage, setBlogsPage] = useState(1);
  const [blogsSearch, setBlogsSearch] = useState("");
  const [activeBlogsSearch, setActiveBlogsSearch] = useState("");
  const [blogStatusFilter, setBlogStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Selected entities for modals
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Queries - fetch all courses across platform (userId = undefined)
  const { data: coursesData, isLoading: isCoursesLoading } = useInstructorCoursesQuery(
    undefined,
    { page: coursesPage, pageSize: 8, search: activeCoursesSearch },
    isAuthenticated
  );

  // Query blog posts for staff
  const { data: blogsData, isLoading: isBlogsLoading } = useBlogPostsQuery(
    {
      page: blogsPage,
      pageSize: 8,
      search: activeBlogsSearch,
      status: blogStatusFilter,
    },
    isAuthenticated
  );

  // Overview query to compute platform-wide blog stats
  const { data: allBlogsSummaryData } = useBlogPostsQuery(
    {
      page: 1,
      pageSize: 100,
      status: "all",
    },
    isAuthenticated
  );

  // Platform-wide enrollments
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useMyEnrollmentsQuery(
    1,
    100,
    isAuthenticated
  );

  // Mutations
  const createCourseMutation = useCreateCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation();
  const deleteCourseMutation = useDeleteCourseMutation();

  const createBlogMutation = useCreateBlogMutation();
  const updateBlogMutation = useUpdateBlogMutation();
  const deleteBlogMutation = useDeleteBlogMutation();

  const courses = coursesData?.data || [];
  const coursesPagination = coursesData?.meta?.pagination || {
    page: 1,
    pageSize: 8,
    pageCount: 1,
    total: 0,
  };

  const blogs = blogsData?.data || [];
  const blogsPagination = blogsData?.meta?.pagination || {
    page: 1,
    pageSize: 8,
    pageCount: 1,
    total: 0,
  };

  const allBlogsList = allBlogsSummaryData?.data || [];
  const totalBlogsCount = allBlogsSummaryData?.meta?.pagination?.total ?? blogsPagination.total;
  const publishedBlogsCount = allBlogsList.filter((b) => !!b.publishedAt).length;
  const draftBlogsCount = allBlogsList.filter((b) => !b.publishedAt).length;

  const enrollments = enrollmentsData?.data || [];
  const completedEnrollmentsCount = enrollments.filter((e) => e.isCompleted).length;

  // Search Handlers
  const handleCoursesSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveCoursesSearch(coursesSearch);
    setCoursesPage(1);
  };

  const handleBlogsSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveBlogsSearch(blogsSearch);
    setBlogsPage(1);
  };

  // Course Actions
  const handleCreateCourse = (values: CourseFormValues, onSuccess?: () => void) => {
    createCourseMutation.mutate(values, {
      onSuccess: () => {
        setIsCourseModalOpen(false);
        onSuccess?.();
      },
    });
  };

  const handleUpdateCourse = (documentId: string, values: CourseFormValues, onSuccess?: () => void) => {
    updateCourseMutation.mutate(
      {
        documentId,
        data: values,
      },
      {
        onSuccess: () => {
          setIsCourseModalOpen(false);
          setEditingCourse(null);
          onSuccess?.();
        },
      }
    );
  };

  const handleDeleteCourse = (documentId: string, onSuccess?: () => void) => {
    deleteCourseMutation.mutate(documentId, {
      onSuccess: () => onSuccess?.(),
    });
  };

  // Blog Actions
  const handleCreateBlog = (values: BlogFormValues, onSuccess?: () => void) => {
    createBlogMutation.mutate(values, {
      onSuccess: () => {
        setIsBlogModalOpen(false);
        onSuccess?.();
      },
    });
  };

  const handleUpdateBlog = (documentId: string, values: BlogFormValues, onSuccess?: () => void) => {
    updateBlogMutation.mutate(
      {
        documentId,
        data: values,
      },
      {
        onSuccess: () => {
          setIsBlogModalOpen(false);
          setEditingBlog(null);
          onSuccess?.();
        },
      }
    );
  };

  const handleDeleteBlog = (documentId: string, onSuccess?: () => void) => {
    deleteBlogMutation.mutate(documentId, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const handleTogglePublishBlog = (blog: BlogPost) => {
    const isCurrentlyPublished = !!blog.publishedAt;
    updateBlogMutation.mutate({
      documentId: blog.documentId,
      data: {
        isPublished: !isCurrentlyPublished,
      },
    });
  };

  const openNewCourseModal = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: Course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const openNewBlogModal = () => {
    setEditingBlog(null);
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsBlogModalOpen(true);
  };

  return {
    user,
    role,
    roleType,
    activeTab,
    setActiveTab,

    // Course Data & State
    courses,
    coursesPagination,
    coursesPage,
    setCoursesPage,
    coursesSearch,
    setCoursesSearch,
    activeCoursesSearch,
    handleCoursesSearchSubmit,
    isCoursesLoading,

    // Blog Data & State
    blogs,
    blogsPagination,
    blogsPage,
    setBlogsPage,
    blogsSearch,
    setBlogsSearch,
    activeBlogsSearch,
    handleBlogsSearchSubmit,
    blogStatusFilter,
    setBlogStatusFilter,
    isBlogsLoading,

    // Stats
    totalCourses: coursesPagination.total,
    totalBlogs: totalBlogsCount,
    publishedBlogsCount,
    draftBlogsCount,
    totalEnrollments: enrollments.length,
    completedEnrollments: completedEnrollmentsCount,
    enrollments,
    isEnrollmentsLoading,

    // Modal state
    editingCourse,
    isCourseModalOpen,
    setIsCourseModalOpen,
    openNewCourseModal,
    openEditCourseModal,

    editingBlog,
    isBlogModalOpen,
    setIsBlogModalOpen,
    openNewBlogModal,
    openEditBlogModal,

    // Operations
    createCourse: handleCreateCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    isCreatingCourse: createCourseMutation.isPending,
    isUpdatingCourse: updateCourseMutation.isPending,
    isDeletingCourse: deleteCourseMutation.isPending,

    createBlog: handleCreateBlog,
    updateBlog: handleUpdateBlog,
    deleteBlog: handleDeleteBlog,
    togglePublishBlog: handleTogglePublishBlog,
    isCreatingBlog: createBlogMutation.isPending,
    isUpdatingBlog: updateBlogMutation.isPending,
    isDeletingBlog: deleteBlogMutation.isPending,
  };
}
