"use client";

import { useState } from "react";
import { useContentManagerOverview } from "@/hooks/use-content-manager-overview";
import { useCourseQuizResultsQuery } from "@/hooks/queries/use-quiz-queries";
import { ContentHeader } from "@/components/content/content-header";
import { ContentStats } from "@/components/content/content-stats";
import { ContentTabsNav } from "@/components/content/content-tabs-nav";
import { CoursesLibraryTab } from "@/components/content/courses-library-tab";
import { EditorialBlogsTab } from "@/components/content/editorial-blogs-tab";
import { GlobalGradebookTab } from "@/components/content/global-gradebook-tab";
import { DeleteConfirmDialog } from "@/components/content/delete-confirm-dialog";
import { CourseFormModal } from "@/components/instructor/course-form-modal";
import { BlogFormModal } from "@/components/blog/blog-form-modal";
import type { Course } from "@/types/course";
import type { BlogPost } from "@/types/blog";

export default function ContentStudioPage() {
  const {
    activeTab,
    setActiveTab,

    // Courses
    courses,
    coursesPagination,
    coursesPage,
    setCoursesPage,
    coursesSearch,
    setCoursesSearch,
    handleCoursesSearchSubmit,
    isCoursesLoading,
    createCourse,
    updateCourse,
    deleteCourse,
    isCreatingCourse,
    isUpdatingCourse,
    isDeletingCourse,

    // Blogs
    blogs,
    blogsPagination,
    blogsPage,
    setBlogsPage,
    blogsSearch,
    setBlogsSearch,
    handleBlogsSearchSubmit,
    blogStatusFilter,
    setBlogStatusFilter,
    isBlogsLoading,
    createBlog,
    updateBlog,
    deleteBlog,
    togglePublishBlog,
    isCreatingBlog,
    isUpdatingBlog,
    isDeletingBlog,

    // Overview Stats
    totalCourses,
    totalBlogs,
    publishedBlogsCount,
    draftBlogsCount,
    totalEnrollments,
    completedEnrollments,
    totalLessonsInPlatform,
    totalQuizzesInPlatform,
    enrollments,
    isEnrollmentsLoading,

    // Modals
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
  } = useContentManagerOverview();

  // Deletion dialog states
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<BlogPost | null>(null);

  // Platform-wide quiz results for gradebook
  const { data: quizResultsData, isLoading: isQuizResultsLoading } = useCourseQuizResultsQuery(
    undefined,
    1,
    100,
    activeTab === "gradebook"
  );

  const quizResults = quizResultsData?.data || [];

  const confirmDeleteCourse = () => {
    if (!deletingCourse) return;
    deleteCourse(deletingCourse.documentId || String(deletingCourse.id), () => {
      setDeletingCourse(null);
    });
  };

  const confirmDeleteBlog = () => {
    if (!deletingBlog) return;
    deleteBlog(deletingBlog.documentId || String(deletingBlog.id), () => {
      setDeletingBlog(null);
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ContentHeader
        onOpenNewCourse={openNewCourseModal}
        onOpenNewBlog={openNewBlogModal}
      />

      <ContentStats
        totalCourses={totalCourses}
        totalBlogs={totalBlogs}
        publishedBlogsCount={publishedBlogsCount}
        draftBlogsCount={draftBlogsCount}
        totalEnrollments={totalEnrollments}
        completedEnrollments={completedEnrollments}
        totalLessonsInPlatform={totalLessonsInPlatform}
        totalQuizzesInPlatform={totalQuizzesInPlatform}
      />

      <div className="space-y-6">
        <ContentTabsNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalCourses={totalCourses}
          totalBlogs={totalBlogs}
          totalEnrollments={totalEnrollments}
        />

        {activeTab === "courses" && (
          <CoursesLibraryTab
            courses={courses}
            pagination={coursesPagination}
            currentPage={coursesPage}
            onPageChange={setCoursesPage}
            search={coursesSearch}
            onSearchChange={setCoursesSearch}
            onSearchSubmit={handleCoursesSearchSubmit}
            isLoading={isCoursesLoading}
            onOpenNewCourse={openNewCourseModal}
            onOpenEditCourse={openEditCourseModal}
            onDeleteCourse={setDeletingCourse}
          />
        )}

        {activeTab === "blogs" && (
          <EditorialBlogsTab
            blogs={blogs}
            pagination={blogsPagination}
            currentPage={blogsPage}
            onPageChange={setBlogsPage}
            search={blogsSearch}
            onSearchChange={setBlogsSearch}
            onSearchSubmit={handleBlogsSearchSubmit}
            statusFilter={blogStatusFilter}
            onStatusFilterChange={setBlogStatusFilter}
            totalBlogs={totalBlogs}
            publishedBlogsCount={publishedBlogsCount}
            draftBlogsCount={draftBlogsCount}
            isLoading={isBlogsLoading}
            onOpenNewBlog={openNewBlogModal}
            onOpenEditBlog={openEditBlogModal}
            onTogglePublishBlog={togglePublishBlog}
            onDeleteBlog={setDeletingBlog}
          />
        )}

        {activeTab === "gradebook" && (
          <GlobalGradebookTab
            enrollments={enrollments}
            quizResults={quizResults}
            isLoading={isEnrollmentsLoading || isQuizResultsLoading}
            totalLessons={totalLessonsInPlatform}
            totalQuizzes={totalQuizzesInPlatform}
          />
        )}
      </div>

      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSubmit={(values) => {
          if (editingCourse) {
            updateCourse(editingCourse.documentId || String(editingCourse.id), values);
          } else {
            createCourse(values);
          }
        }}
        course={editingCourse}
        isLoading={isCreatingCourse || isUpdatingCourse}
      />

      <BlogFormModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSubmit={(values) => {
          if (editingBlog) {
            updateBlog(editingBlog.documentId || String(editingBlog.id), values);
          } else {
            createBlog(values);
          }
        }}
        initialData={editingBlog}
        isLoading={isCreatingBlog || isUpdatingBlog}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={confirmDeleteCourse}
        title="Delete Course"
        itemName={deletingCourse?.title}
        description={
          deletingCourse
            ? `Are you sure you want to delete "${deletingCourse.title}"? All associated lessons, quizzes, progress, and student enrollments will be permanently removed.`
            : undefined
        }
        isLoading={isDeletingCourse}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingBlog}
        onClose={() => setDeletingBlog(null)}
        onConfirm={confirmDeleteBlog}
        title="Delete Blog Article"
        itemName={deletingBlog?.title}
        isLoading={isDeletingBlog}
      />
    </main>
  );
}
