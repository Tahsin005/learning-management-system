"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlatformStats } from "@/lib/api/admin";
import { Users, BookOpen, GraduationCap, Award, Shield, FileText } from "lucide-react";

interface AdminStatsCardsProps {
  stats?: PlatformStats;
  isLoading?: boolean;
}

export function AdminStatsCards({ stats, isLoading }: AdminStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse bg-muted/40 border-border/50">
            <CardContent className="p-5 h-32 flex flex-col justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-3 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const roleBreakdown = stats.usersByRole || {
    admin: 0,
    content_manager: 0,
    instructor: 0,
    student: 0,
    other: 0,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/60 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Users
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {stats.totalUsers}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Registered platform accounts
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/60 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Courses
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {stats.totalCourses}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Published & active curriculums
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/60 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Enrollments
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {stats.totalEnrollments}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Active student learning seats
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/60 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Lessons & Quizzes
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {stats.totalLessons + stats.totalQuizzes}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {stats.totalLessons} lessons • {stats.totalQuizzes} assessments
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-card border border-border/60 text-xs">
        <span className="font-semibold text-muted-foreground mr-1 flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" /> Role Distribution:
        </span>
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 gap-1 font-medium">
          Admins: <span className="font-bold">{roleBreakdown.admin}</span>
        </Badge>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1 font-medium">
          Content Managers: <span className="font-bold">{roleBreakdown.content_manager}</span>
        </Badge>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 font-medium">
          Instructors: <span className="font-bold">{roleBreakdown.instructor}</span>
        </Badge>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 gap-1 font-medium">
          Students: <span className="font-bold">{roleBreakdown.student}</span>
        </Badge>
      </div>
    </div>
  );
}
