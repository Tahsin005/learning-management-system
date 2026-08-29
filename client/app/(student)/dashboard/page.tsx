"use client";

import { useState } from "react";
import { Loader2, GraduationCap, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useMyEnrollmentsQuery } from "@/hooks/queries/use-enrollment-queries";
import { useMyQuizResultsQuery } from "@/hooks/queries/use-quiz-queries";
import type { QuizResultRecord } from "@/types/course";
import type { ChangePasswordFormValues } from "@/lib/validations/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { EnrolledCoursesList } from "@/components/dashboard/enrolled-courses-list";
import { QuizScoresList } from "@/components/dashboard/quiz-scores-list";
import { QuizResultModal } from "@/components/dashboard/quiz-result-modal";
import { AccountProfileCard } from "@/components/dashboard/account-profile-card";
import { SecurityTab } from "@/components/dashboard/security-tab";

export default function StudentDashboardPage() {
  const {
    user,
    role,
    roleType,
    isAuthenticated,
    changePassword,
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

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    await changePassword(values);
  };

  if (!user && !isLoggingOut) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DashboardHeader
          user={user}
          role={role}
          roleType={roleType}
        />

        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="text-xs font-semibold"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "courses" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("courses")}
            className="text-xs font-semibold gap-1.5"
          >
            <span>Enrolled Courses</span>
            {enrollmentsPagination.total > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                {enrollmentsPagination.total}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "quizzes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("quizzes")}
            className="text-xs font-semibold gap-1.5"
          >
            <span>Quiz Scores</span>
            {quizPagination.total > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                {quizPagination.total}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "security" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("security")}
            className="text-xs font-semibold gap-1.5"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Security & Password</span>
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <DashboardStats
              role={role}
              roleType={roleType}
              enrolledCount={enrollmentsPagination.total}
              quizzesCount={quizPagination.total}
              memberSince={user?.createdAt}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>My Enrolled Courses</span>
                </h2>
                <Link
                  href="/courses"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs gap-1 text-primary")}
                >
                  <span>Browse All Courses</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <EnrolledCoursesList
                enrollments={enrollments}
                isLoading={isEnrollmentsLoading}
                page={coursesPage}
                pageCount={enrollmentsPagination.pageCount}
                total={enrollmentsPagination.total}
                onPageChange={setCoursesPage}
              />
            </div>

            <AccountProfileCard
              user={user}
              role={role}
              roleType={roleType}
            />
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  My Enrolled Courses
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All active learning tracks associated with your account
                </p>
              </div>
              <Link
                href="/courses"
                className={cn(buttonVariants({ size: "sm" }), "bg-primary text-white text-xs font-semibold gap-1.5")}
              >
                <span>Find More Courses</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <EnrolledCoursesList
              enrollments={enrollments}
              isLoading={isEnrollmentsLoading}
              page={coursesPage}
              pageCount={enrollmentsPagination.pageCount}
              total={enrollmentsPagination.total}
              onPageChange={setCoursesPage}
            />
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Assessment History & Grades
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review your past quiz submissions and inspect detailed question breakdowns
              </p>
            </div>

            <QuizScoresList
              quizResults={quizResults}
              isLoading={isQuizResultsLoading}
              page={quizzesPage}
              pageCount={quizPagination.pageCount}
              total={quizPagination.total}
              onPageChange={setQuizzesPage}
              onSelectResult={setSelectedQuizResult}
            />
          </div>
        )}

        {activeTab === "security" && (
          <SecurityTab
            onChangePassword={handleChangePassword}
            isChangingPassword={isChangingPassword}
          />
        )}
      </main>

      <QuizResultModal
        result={selectedQuizResult}
        onClose={() => setSelectedQuizResult(null)}
      />
    </div>
  );
}
