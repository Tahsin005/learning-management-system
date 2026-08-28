"use client";

import Link from "next/link";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Enrollment } from "@/types/course";

interface EnrolledCourseCardProps {
  enrollment: Enrollment;
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const c = enrollment.course;
  if (!c) return null;

  const cDocId = c.documentId || c.id;
  const isCompleted = enrollment.isCompleted;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className={cn(
        "bg-card border shadow-sm flex flex-col justify-between transition-all",
        isCompleted
          ? "border-emerald-500/30 hover:border-emerald-500/60"
          : "border-border/80 hover:border-primary/50"
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-muted-foreground font-medium">
            Enrolled {formatDate(enrollment.enrolledAt)}
          </span>

          {isCompleted ? (
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Completed</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-medium flex items-center gap-1"
            >
              <Clock className="h-3 w-3" />
              <span>In Progress</span>
            </Badge>
          )}
        </div>

        <CardTitle className="text-base font-bold line-clamp-1 text-foreground">
          {c.title}
        </CardTitle>
        <CardDescription className="text-xs line-clamp-2 leading-relaxed">
          {c.description}
        </CardDescription>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {enrollment.completedLessons || 0} of {enrollment.totalLessons || 0} Lessons
              {(enrollment.totalQuizzes || 0) > 0
                ? ` • ${enrollment.completedQuizzes || 0}/${enrollment.totalQuizzes || 0} Quizzes`
                : ""}
            </span>
            <span
              className={cn(
                "font-bold",
                isCompleted ? "text-emerald-400" : "text-foreground"
              )}
            >
              {enrollment.progressPercentage || 0}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isCompleted ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${enrollment.progressPercentage || 0}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardFooter className="pt-3 border-t border-border/40 mt-auto">
        <Link
          href={`/courses/${cDocId}`}
          className={cn(
            buttonVariants({
              size: "sm",
              variant: isCompleted ? "outline" : "default",
            }),
            "w-full gap-2 font-semibold",
            isCompleted
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-300"
              : "bg-primary text-white shadow-sm"
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Review Course</span>
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              <span>Continue Learning</span>
            </>
          )}
        </Link>
      </CardFooter>
    </Card>
  );
}
