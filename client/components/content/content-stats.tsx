"use client";

import { BookOpen, FileText, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentStatsProps {
  totalCourses: number;
  totalBlogs: number;
  publishedBlogsCount: number;
  draftBlogsCount: number;
  totalEnrollments: number;
  completedEnrollments: number;
  totalLessonsInPlatform: number;
  totalQuizzesInPlatform: number;
}

export function ContentStats({
  totalCourses,
  totalBlogs,
  publishedBlogsCount,
  draftBlogsCount,
  totalEnrollments,
  completedEnrollments,
  totalLessonsInPlatform,
  totalQuizzesInPlatform,
}: ContentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border/80 bg-card/70">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Platform Courses
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-foreground">{totalCourses}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Active learning curriculums
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/70">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Editorial Blog Articles
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-foreground">{totalBlogs}</div>
          <div className="flex items-center gap-2 mt-1 text-[11px]">
            <span className="text-emerald-400 font-semibold">{publishedBlogsCount} Published</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{draftBlogsCount} Drafts</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/70">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Global Enrollments
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-foreground">{totalEnrollments}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {completedEnrollments} completed graduations
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/70">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Platform Content Scope
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-foreground">
            {totalLessonsInPlatform + totalQuizzesInPlatform}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {totalLessonsInPlatform} lessons & {totalQuizzesInPlatform} quizzes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
