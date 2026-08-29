"use client";

import { Shield, BookOpen, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Role } from "@/types/auth";

interface DashboardStatsProps {
  role?: Role | null;
  roleType?: string;
  enrolledCount: number;
  quizzesCount: number;
  memberSince?: string;
}

export function DashboardStats({
  role,
  roleType = "",
  enrolledCount,
  quizzesCount,
  memberSince,
}: DashboardStatsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleDescription = () => {
    if (role?.description) return role.description;
    const type = (role?.type || roleType || "student").toLowerCase();
    switch (type) {
      case "admin":
        return "Full control of the platform. Manages users and assigns/changes their roles.";
      case "content_manager":
        return "Creates and manages courses, lessons, and blog posts across the platform.";
      case "instructor":
        return "Manages own courses, lessons, quizzes, and student progress.";
      case "student":
      default:
        return "Enrolls in courses, views lessons, takes quizzes, and tracks progress.";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border/80 shadow-sm flex flex-col justify-between">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
            Account Status
          </span>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-2xl font-bold text-foreground capitalize">
            {role?.name || roleType || "Active"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {getRoleDescription()}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/80 shadow-sm flex flex-col justify-between">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
            Enrolled Courses
          </span>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-2xl font-bold text-foreground">
            {enrolledCount}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Active learning paths
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/80 shadow-sm flex flex-col justify-between">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
            Assessments Taken
          </span>
          <Award className="h-4 w-4 text-indigo-400" />
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-2xl font-bold text-foreground">
            {quizzesCount}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Completed quiz submissions
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/80 shadow-sm flex flex-col justify-between">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
            Member Since
          </span>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-2xl font-bold text-foreground">
            {formatDate(memberSince)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Account created
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
