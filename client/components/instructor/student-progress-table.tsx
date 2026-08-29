"use client";

import { useState } from "react";
import { Users, CheckCircle2, Clock, Eye, Award, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Enrollment, QuizResultRecord } from "@/types/course";

interface StudentProgressTableProps {
  enrollments: Enrollment[];
  quizResults: QuizResultRecord[];
  isLoading: boolean;
  totalLessons: number;
  totalQuizzes: number;
  currentCourseDocId?: string;
}

export function StudentProgressTable({
  enrollments,
  quizResults,
  isLoading,
  totalLessons,
  totalQuizzes,
  currentCourseDocId,
}: StudentProgressTableProps) {
  const [selectedStudentSubmissions, setSelectedStudentSubmissions] = useState<{
    studentName: string;
    results: QuizResultRecord[];
  } | null>(null);

  const [inspectResultDetail, setInspectResultDetail] = useState<QuizResultRecord | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStudentCourseResults = (studentId: number) => {
    return quizResults.filter((r) => {
      if (r.student?.id !== studentId) return false;
      if (currentCourseDocId && r.quiz?.course?.documentId) {
        return r.quiz.course.documentId === currentCourseDocId;
      }
      return true;
    });
  };

  const handleOpenStudentSubmissions = (studentId: number, studentName: string) => {
    const studentResults = getStudentCourseResults(studentId);
    setSelectedStudentSubmissions({
      studentName,
      results: studentResults,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-card border border-border/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center space-y-4 bg-card/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Users className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">No Enrolled Students Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            When students enroll in this course, their lesson progress and quiz grades will automatically populate this gradebook.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Enrolled On</th>
                <th className="py-3.5 px-4">Lesson Progress</th>
                <th className="py-3.5 px-4">Quiz Submissions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground font-normal">
              {enrollments.map((enr) => {
                const sId = enr.student?.id || 0;
                const sName = enr.student?.username || "Student";
                const sEmail = enr.student?.email || "";

                const completedLessons = enr.completedLessons || 0;
                const studentResults = getStudentCourseResults(sId);
                const completedQuizzes = studentResults.length > 0 ? studentResults.length : (enr.completedQuizzes || 0);

                const totalItems = totalLessons + totalQuizzes;
                const completedItems = Math.min(completedLessons, totalLessons) + Math.min(completedQuizzes, totalQuizzes);
                const progressPct = totalItems > 0 ? Math.min(100, Math.round((completedItems / totalItems) * 100)) : 0;
                const isCompleted = (totalLessons === 0 || completedLessons >= totalLessons) && (totalQuizzes === 0 || completedQuizzes >= totalQuizzes);

                return (
                  <tr key={enr.documentId || enr.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {sName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xs">{sName}</p>
                          <p className="text-[11px] text-muted-foreground">{sEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {formatDate(enr.enrolledAt)}
                    </td>

                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-medium text-foreground">
                            {completedLessons} / {totalLessons} Lessons
                          </span>
                          <span className="font-bold text-primary">{progressPct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">
                          {completedQuizzes} / {totalQuizzes}
                        </span>
                        {studentResults.length > 0 && (
                          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                            {studentResults.length} {studentResults.length === 1 ? "record" : "records"}
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 w-fit"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Completed</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px] font-medium flex items-center gap-1 w-fit"
                        >
                          <Clock className="h-3 w-3" />
                          <span>In Progress</span>
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenStudentSubmissions(sId, sName)}
                        className="gap-1.5 text-xs h-8 border-border/70 hover:border-primary/50"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>Inspect Quizzes</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!selectedStudentSubmissions}
        onOpenChange={(open) => !open && setSelectedStudentSubmissions(null)}
      >
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Assessment Records: {selectedStudentSubmissions?.studentName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submitted quiz assessments and auto-graded results
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {!selectedStudentSubmissions?.results || selectedStudentSubmissions.results.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-muted/20 border border-border/60 text-xs text-muted-foreground">
                This student has not submitted any quiz assessments for this course yet.
              </div>
            ) : (
              selectedStudentSubmissions.results.map((res) => {
                const percentage =
                  res.totalQuestions > 0 ? Math.round((res.score / res.totalQuestions) * 100) : 0;
                const isPassed = percentage >= 70;

                return (
                  <div
                    key={res.documentId || res.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card gap-4"
                  >
                    <div>
                      <p className="font-semibold text-xs text-foreground">
                        {res.quiz?.title || "Course Assessment"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Submitted: {formatDate(res.submittedAt)} • Score: {res.score}/{res.totalQuestions}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold",
                          isPassed
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        )}
                      >
                        {percentage}% {isPassed ? "Passed" : "Needs Review"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInspectResultDetail(res)}
                        className="h-8 text-xs text-primary hover:text-primary"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStudentSubmissions(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!inspectResultDetail}
        onOpenChange={(open) => !open && setInspectResultDetail(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {inspectResultDetail && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">
                    Student Submission Breakdown
                  </Badge>
                </div>
                <DialogTitle className="text-lg font-bold">
                  {inspectResultDetail.quiz?.title || "Quiz Assessment"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Submitted by {inspectResultDetail.student?.username} on {formatDate(inspectResultDetail.submittedAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-between rounded-2xl bg-muted/40 border border-border/70 p-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Total Score
                  </span>
                  <p className="text-2xl font-extrabold text-foreground">
                    {inspectResultDetail.score} / {inspectResultDetail.totalQuestions}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Percentage
                  </span>
                  <p className="text-3xl font-extrabold text-primary">
                    {inspectResultDetail.totalQuestions > 0
                      ? Math.round((inspectResultDetail.score / inspectResultDetail.totalQuestions) * 100)
                      : 0}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  <span>Question-by-Question Answers</span>
                </h4>

                {(inspectResultDetail.answers || []).map((ans, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl border p-4 space-y-3",
                      ans.isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        Question {idx + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold flex items-center gap-1",
                          ans.isCorrect
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        )}
                      >
                        {ans.isCorrect ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        <span>{ans.isCorrect ? "Correct" : "Incorrect"}</span>
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      {ans.questionText}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {(ans.options || []).map((optText, optIdx) => {
                        const isChosen = ans.selectedOptionIndex === optIdx;
                        const isCorrectKey = ans.correctAnswerIndex === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={cn(
                              "flex items-center justify-between rounded-lg p-2 text-xs border transition-all",
                              isCorrectKey
                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-medium"
                                : isChosen && !ans.isCorrect
                                ? "border-destructive bg-destructive/15 text-destructive font-medium"
                                : "border-border/40 bg-muted/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                                  isCorrectKey
                                    ? "bg-emerald-500 text-white"
                                    : isChosen && !ans.isCorrect
                                    ? "bg-destructive text-white"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{optText}</span>
                            </div>

                            {isCorrectKey && (
                              <span className="text-[9px] font-bold text-emerald-400">Correct Key</span>
                            )}
                            {isChosen && !ans.isCorrect && (
                              <span className="text-[9px] font-bold text-destructive">Student Choice</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setInspectResultDetail(null)}>
                  Back
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
