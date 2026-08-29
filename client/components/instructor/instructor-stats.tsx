"use client";

import { BookOpen, Users, CheckCircle2, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InstructorStatsProps {
  totalCourses: number;
  totalEnrollments: number;
  completedEnrollments: number;
  totalQuizzes: number;
}

export function InstructorStats({
  totalCourses,
  totalEnrollments,
  completedEnrollments,
  totalQuizzes,
}: InstructorStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border/80 bg-card shadow-sm hover:border-primary/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            My Authored Courses
          </CardTitle>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalCourses}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Active courses in your catalog
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card shadow-sm hover:border-emerald-500/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Enrolled Students
          </CardTitle>
          <Users className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalEnrollments}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all of your courses
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card shadow-sm hover:border-indigo-500/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Course Completions
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{completedEnrollments}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Students finished all lessons & quizzes
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card shadow-sm hover:border-amber-500/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Assessment Quizzes
          </CardTitle>
          <Award className="h-4 w-4 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalQuizzes}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Auto-graded MCQ assessments created
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
