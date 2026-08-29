"use client";

import { use, useState } from "react";
import Link from "next/link";
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
import { useCourseStudio } from "@/hooks/use-course-studio";

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

  const [activeTab, setActiveTab] = useState<"curriculum" | "quizzes" | "students" | "settings">("curriculum");

  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);

  const [isAddQuizOpen, setIsAddQuizOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);

  const {
    course,
    lessons,
    quizzes,
    courseEnrollments,
    quizResults,
    isLoading: isCourseLoading,
    isLessonsLoading,
    isQuizzesLoading,
    isEnrollmentsLoading,
    isError,
    createLesson,
    updateLesson,
    deleteLesson,
    isCreatingLesson,
    isUpdatingLesson,
    isDeletingLesson,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    isCreatingQuiz,
    isUpdatingQuiz,
    isDeletingQuiz,
    updateCourse,
    deleteCourse,
    isUpdatingCourse,
    isDeletingCourse,
  } = useCourseStudio(courseDocId);

  const handleCreateLesson = (values: LessonFormValues) => {
    createLesson(values, () => setIsAddLessonOpen(false));
  };

  const handleUpdateLesson = (values: LessonFormValues) => {
    if (!editingLesson) return;
    updateLesson(String(editingLesson.documentId || editingLesson.id), values, () => setEditingLesson(null));
  };

  const handleDeleteLesson = () => {
    if (!deletingLesson) return;
    deleteLesson(String(deletingLesson.documentId || deletingLesson.id), () => setDeletingLesson(null));
  };

  const handleCreateQuiz = (title: string, questions: Omit<QuizQuestion, "id">[]) => {
    createQuiz({ title, questions }, () => setIsAddQuizOpen(false));
  };

  const handleUpdateQuiz = (title: string, questions: Omit<QuizQuestion, "id">[]) => {
    if (!editingQuiz) return;
    updateQuiz(String(editingQuiz.documentId || editingQuiz.id), { title, questions }, () => setEditingQuiz(null));
  };

  const handleDeleteQuiz = () => {
    if (!deletingQuiz) return;
    deleteQuiz(String(deletingQuiz.documentId || deletingQuiz.id), () => setDeletingQuiz(null));
  };

  const handleUpdateCourse = (values: CourseFormValues) => {
    updateCourse(values, () => setIsEditCourseOpen(false));
  };

  const handleDeleteCourse = () => {
    deleteCourse(() => setIsDeleteCourseOpen(false));
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
          <div className="pt-2">
            <Link
              href="/instructor"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2 text-xs")}
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Instructor Studio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <Breadcrumb className="text-xs">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/instructor" />}>
                    Instructor Studio
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-foreground truncate max-w-xs sm:max-w-md">
                    {course.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span>{course.title}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Authoring Studio
              </Badge>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${courseDocId}`}
              target="_blank"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Course</span>
            </Link>
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
            <span>Lessons</span>
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
              {lessons.length}
            </Badge>
          </Button>

          <Button
            variant={activeTab === "quizzes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("quizzes")}
            className="text-xs font-semibold gap-1.5"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Quizzes</span>
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
              {quizzes.length}
            </Badge>
          </Button>

          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("students")}
            className="text-xs font-semibold gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Students & Gradebook</span>
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
              {courseEnrollments.length}
            </Badge>
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
                className="gap-1.5 bg-primary text-white font-semibold text-xs shadow-sm"
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
                    Start structuring your course syllabus by adding your first sequential learning lesson.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddLessonOpen(true)}
                  className="bg-primary text-white text-xs font-semibold"
                >
                  Create First Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.documentId || lesson.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all shadow-sm gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {lesson.title}
                          </p>
                          {lesson.videoUrl && (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[9px] gap-1 shrink-0">
                              <Video className="h-2.5 w-2.5" />
                              <span>Video</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-md mt-0.5">
                          {lesson.content ? lesson.content.slice(0, 80) + "..." : "No notes content"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLesson(lesson)}
                        className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
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
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.documentId || quiz.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-card hover:border-indigo-500/40 transition-all shadow-sm gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-xs">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {quiz.questions?.length || 0} Questions • Auto-Graded Multiple Choice
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuiz(quiz)}
                        className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
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
              quizResults={quizResults}
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
        isLoading={isCreatingLesson}
      />

      <LessonFormModal
        isOpen={!!editingLesson}
        onClose={() => setEditingLesson(null)}
        onSubmit={handleUpdateLesson}
        lesson={editingLesson}
        isLoading={isUpdatingLesson}
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
              disabled={isDeletingLesson}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteLesson}
              disabled={isDeletingLesson}
            >
              {isDeletingLesson ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuizBuilderModal
        isOpen={isAddQuizOpen}
        onClose={() => setIsAddQuizOpen(false)}
        onSubmit={handleCreateQuiz}
        isLoading={isCreatingQuiz}
      />

      <QuizBuilderModal
        isOpen={!!editingQuiz}
        onClose={() => setEditingQuiz(null)}
        onSubmit={handleUpdateQuiz}
        quiz={editingQuiz}
        isLoading={isUpdatingQuiz}
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
              disabled={isDeletingQuiz}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteQuiz}
              disabled={isDeletingQuiz}
            >
              {isDeletingQuiz ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CourseFormModal
        isOpen={isEditCourseOpen}
        onClose={() => setIsEditCourseOpen(false)}
        onSubmit={handleUpdateCourse}
        course={course}
        isLoading={isUpdatingCourse}
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
              disabled={isDeletingCourse}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteCourse}
              disabled={isDeletingCourse}
            >
              {isDeletingCourse ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
