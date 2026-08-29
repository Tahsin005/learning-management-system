"use client";

import { use, useState } from "react";
import Link from "next/link";
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
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useCourseQuizResultsQuery,
} from "@/hooks/queries/use-quiz-queries";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Layers,
  Users,
  Settings,
  PlusCircle,
  Trash2,
  Edit,
  ExternalLink,
  Loader2,
  ArrowLeft,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson, Quiz, QuizQuestion } from "@/types/course";
import type { LessonFormValues, CourseFormValues } from "@/lib/validations/course";

import { LessonFormModal } from "@/components/instructor/lesson-form-modal";
import { QuizBuilderModal } from "@/components/instructor/quiz-builder-modal";
import { StudentProgressTable } from "@/components/instructor/student-progress-table";
import { CourseFormModal } from "@/components/instructor/course-form-modal";

interface CourseStudioPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseStudioPage({ params }: CourseStudioPageProps) {
  const resolvedParams = use(params);
  const courseDocId = resolvedParams.id;
  const router = useRouter();

  const { user, roleType, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"curriculum" | "quizzes" | "students" | "settings">("curriculum");

  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);

  const [isAddQuizOpen, setIsAddQuizOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);

  const { data: courseData, isLoading: isCourseLoading, isError } = useCourseQuery(courseDocId);
  const { data: lessonsData, isLoading: isLessonsLoading } = useLessonsByCourseQuery(courseDocId);
  const { data: quizzesData, isLoading: isQuizzesLoading } = useQuizzesByCourseQuery(courseDocId);
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useMyEnrollmentsQuery(1, 100, isAuthenticated);
  const { data: quizResultsData } = useCourseQuizResultsQuery(courseDocId, isAuthenticated);

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

  const handleCreateLesson = async (values: LessonFormValues) => {
    await createLessonMutation.mutateAsync({
      title: values.title,
      content: values.content,
      videoUrl: values.videoUrl || null,
      course: courseDocId,
      order: lessons.length + 1,
    });
  };

  const handleUpdateLesson = async (values: LessonFormValues) => {
    if (!editingLesson) return;
    await updateLessonMutation.mutateAsync({
      documentId: String(editingLesson.documentId || editingLesson.id),
      data: {
        title: values.title,
        content: values.content,
        videoUrl: values.videoUrl || null,
      },
    });
  };

  const handleDeleteLesson = async () => {
    if (!deletingLesson) return;
    await deleteLessonMutation.mutateAsync(String(deletingLesson.documentId || deletingLesson.id));
    setDeletingLesson(null);
  };

  const handleCreateQuiz = async (title: string, questions: Omit<QuizQuestion, "id">[]) => {
    await createQuizMutation.mutateAsync({
      title,
      course: courseDocId,
      questions,
    });
  };

  const handleUpdateQuiz = async (title: string, questions: Omit<QuizQuestion, "id">[]) => {
    if (!editingQuiz) return;
    await updateQuizMutation.mutateAsync({
      documentId: String(editingQuiz.documentId || editingQuiz.id),
      data: {
        title,
        questions,
      },
    });
  };

  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    await deleteQuizMutation.mutateAsync(String(deletingQuiz.documentId || deletingQuiz.id));
    setDeletingQuiz(null);
  };

  const handleUpdateCourse = async (values: CourseFormValues) => {
    await updateCourseMutation.mutateAsync({
      documentId: courseDocId,
      data: values,
    });
  };

  const handleDeleteCourse = async () => {
    await deleteCourseMutation.mutateAsync(courseDocId);
    router.push("/instructor");
  };

  if (isCourseLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading course studio...</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <main className="flex-1 container mx-auto max-w-xl px-4 py-20 text-center space-y-6">
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 space-y-4">
          <h2 className="text-xl font-bold text-destructive">Course Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The requested course could not be located or you may lack instructor access.
          </p>
          <Link
            href="/instructor"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Studio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/instructor" />}>
                  Instructor Studio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground truncate max-w-[200px] sm:max-w-md">
                  {course.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${courseDocId}`}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs")}
            >
              <span>Preview Course</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/instructor"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-xs")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Courses</span>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/60 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                  Course Studio
                </Badge>
                {isOwner && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Author
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {course.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditCourseOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Edit Settings</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
          <Button
            variant={activeTab === "curriculum" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("curriculum")}
            className="text-xs font-semibold gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Lessons ({lessons.length})</span>
          </Button>

          <Button
            variant={activeTab === "quizzes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("quizzes")}
            className="text-xs font-semibold gap-1.5"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>Quizzes ({quizzes.length})</span>
          </Button>

          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("students")}
            className="text-xs font-semibold gap-1.5"
          >
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span>Students & Gradebook ({courseEnrollments.length})</span>
          </Button>

          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className="text-xs font-semibold gap-1.5"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Course Settings</span>
          </Button>
        </div>

        {activeTab === "curriculum" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Course Lessons</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sequential modules containing video stream embeds and markdown notes
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddLessonOpen(true)}
                className="gap-1.5 bg-primary text-white font-semibold text-xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Lesson</span>
              </Button>
            </div>

            {isLessonsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-card border border-border/60 animate-pulse" />
                ))}
              </div>
            ) : lessons.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-foreground">No Lessons Created</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Add your first video stream lesson to this course syllabus.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddLessonOpen(true)}
                  className="bg-primary text-white text-xs font-semibold"
                >
                  Add First Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.documentId || lesson.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/80 bg-card gap-4 shadow-sm hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                        {idx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-foreground">{lesson.title}</p>
                          {lesson.videoUrl && (
                            <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/30 flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              <span>Video</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {lesson.content ? lesson.content.slice(0, 90) + "..." : "No notes"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLesson(lesson)}
                        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingLesson(lesson)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete Lesson"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Course Assessments</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Interactive multiple-choice quizzes with auto-grading rules
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddQuizOpen(true)}
                className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Build Assessment Quiz</span>
              </Button>
            </div>

            {isQuizzesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-card border border-border/60 animate-pulse" />
                ))}
              </div>
            ) : quizzes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-foreground">No Assessments Built</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Create MCQ quizzes to test student understanding and award grades.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddQuizOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Build Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {quizzes.map((quiz, qIdx) => (
                  <div
                    key={quiz.documentId || quiz.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/80 bg-card gap-4 shadow-sm hover:border-indigo-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-xs border border-indigo-500/20">
                        Q{qIdx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm text-foreground">{quiz.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {quiz.questions?.length || 0} Questions • Auto-Graded
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuiz(quiz)}
                        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Quiz</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingQuiz(quiz)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete Quiz"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h3 className="text-lg font-bold text-foreground">Course Gradebook & Student Progress</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track lesson completion percentages and inspect individual student quiz grades
              </p>
            </div>

            <StudentProgressTable
              enrollments={courseEnrollments}
              quizResults={quizResultsData?.data || []}
              isLoading={isEnrollmentsLoading}
              totalLessons={lessons.length}
              totalQuizzes={quizzes.length}
              currentCourseDocId={courseDocId}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            <Card className="border-border/80 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">Course Meta Details</CardTitle>
                <CardDescription className="text-xs">
                  Update syllabus title and description presented to students in the catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsEditCourseOpen(true)}
                  className="bg-primary text-white font-semibold text-xs"
                >
                  Edit Course Information
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-destructive">Danger Zone</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Permanently delete this course, its lessons, quizzes, and student enrollments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteCourseOpen(true)}
                  className="text-xs font-semibold"
                >
                  Delete Course Permanently
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <LessonFormModal
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        onSubmit={handleCreateLesson}
        isLoading={createLessonMutation.isPending}
      />

      <LessonFormModal
        isOpen={!!editingLesson}
        onClose={() => setEditingLesson(null)}
        onSubmit={handleUpdateLesson}
        lesson={editingLesson}
        isLoading={updateLessonMutation.isPending}
      />

      <Dialog
        open={!!deletingLesson}
        onOpenChange={(open) => !open && setDeletingLesson(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Delete Lesson Module
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deletingLesson?.title}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingLesson(null)}
              disabled={deleteLessonMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteLesson}
              disabled={deleteLessonMutation.isPending}
            >
              {deleteLessonMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuizBuilderModal
        isOpen={isAddQuizOpen}
        onClose={() => setIsAddQuizOpen(false)}
        onSubmit={handleCreateQuiz}
        isLoading={createQuizMutation.isPending}
      />

      <QuizBuilderModal
        isOpen={!!editingQuiz}
        onClose={() => setEditingQuiz(null)}
        onSubmit={handleUpdateQuiz}
        quiz={editingQuiz}
        isLoading={updateQuizMutation.isPending}
      />

      <Dialog
        open={!!deletingQuiz}
        onOpenChange={(open) => !open && setDeletingQuiz(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Delete Assessment Quiz
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deletingQuiz?.title}</strong>? All question definitions will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingQuiz(null)}
              disabled={deleteQuizMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteQuiz}
              disabled={deleteQuizMutation.isPending}
            >
              {deleteQuizMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CourseFormModal
        isOpen={isEditCourseOpen}
        onClose={() => setIsEditCourseOpen(false)}
        onSubmit={handleUpdateCourse}
        course={course}
        isLoading={updateCourseMutation.isPending}
      />

      <Dialog
        open={isDeleteCourseOpen}
        onOpenChange={(open) => !open && setIsDeleteCourseOpen(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Delete Entire Course
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{course.title}</strong>? This action cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteCourseOpen(false)}
              disabled={deleteCourseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteCourse}
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
