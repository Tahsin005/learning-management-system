"use client";

import { useState } from "react";
import { Search, GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useInstructorCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/hooks/queries/use-course-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PaginationBar } from "@/components/ui/pagination-bar";
import type { Course } from "@/types/course";
import type { CourseFormValues } from "@/lib/validations/course";

import { InstructorHeader } from "@/components/instructor/instructor-header";
import { InstructorStats } from "@/components/instructor/instructor-stats";
import { InstructorCourseCard } from "@/components/instructor/instructor-course-card";
import { CourseFormModal } from "@/components/instructor/course-form-modal";

export default function InstructorOverviewPage() {
  const { user, role, roleType, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

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

  const handleCreateCourse = async (values: CourseFormValues) => {
    await createCourseMutation.mutateAsync(values);
  };

  const handleUpdateCourse = async (values: CourseFormValues) => {
    if (!editingCourse) return;
    await updateCourseMutation.mutateAsync({
      documentId: String(editingCourse.documentId || editingCourse.id),
      data: values,
    });
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    await deleteCourseMutation.mutateAsync(String(deletingCourse.documentId || deletingCourse.id));
    setDeletingCourse(null);
  };

  const getCourseEnrollmentCount = (courseId: string | number) => {
    return enrollments.filter(
      (e) =>
        e.course?.documentId === String(courseId) ||
        String(e.course?.id) === String(courseId)
    ).length;
  };

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <InstructorHeader
          user={user}
          role={role}
          roleType={roleType}
          onOpenCreateCourse={() => setIsCreateModalOpen(true)}
        />

        <InstructorStats
          totalCourses={pagination.total}
          totalEnrollments={enrollments.length}
          completedEnrollments={completedEnrollmentsCount}
          totalQuizzes={totalQuizzesCount}
        />

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                My Authored Courses
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage syllabi, sequential lessons, MCQ assessments, and track student completion
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-72">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filter courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-card border-border/80 h-9 text-xs"
                />
              </div>
              <Button type="submit" size="sm" className="h-9 px-3 bg-primary text-white text-xs">
                Search
              </Button>
            </form>
          </div>

          {isCoursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-56 rounded-2xl bg-card border border-border/60 animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">No Courses Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {activeSearch
                    ? `No authored courses match "${activeSearch}".`
                    : "You have not created any courses yet. Launch your first course module below."}
                </p>
              </div>
              <div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary text-white font-semibold text-xs"
                >
                  Create Course Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const cDocId = course.documentId || course.id;
                  const enrolledCount = getCourseEnrollmentCount(cDocId);

                  return (
                    <InstructorCourseCard
                      key={cDocId}
                      course={course}
                      enrolledCount={enrolledCount}
                      onEdit={(c) => setEditingCourse(c)}
                      onDelete={(c) => setDeletingCourse(c)}
                    />
                  );
                })}
              </div>

              <PaginationBar
                page={page}
                pageCount={pagination.pageCount}
                total={pagination.total}
                itemLabel="Authored Courses"
                onPageChange={setPage}
                isLoading={isCoursesLoading}
              />
            </div>
          )}
        </div>
      </main>

      <CourseFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCourse}
        isLoading={createCourseMutation.isPending}
      />

      <CourseFormModal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        onSubmit={handleUpdateCourse}
        course={editingCourse}
        isLoading={updateCourseMutation.isPending}
      />

      <Dialog
        open={!!deletingCourse}
        onOpenChange={(open) => !open && setDeletingCourse(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Delete Course
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deletingCourse?.title}</strong>? This will remove all associated lessons and quizzes permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingCourse(null)}
              disabled={deleteCourseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteCourse}
              disabled={deleteCourseMutation.isPending}
              className="gap-1.5"
            >
              {deleteCourseMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Confirm Delete</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
