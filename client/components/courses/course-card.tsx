"use client";

import Link from "next/link";
import { BookOpen, Layers, CheckCircle2, PlayCircle, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
}

export function CourseCard({ course, isEnrolled }: CourseCardProps) {
  const courseDocId = course.documentId || course.id;
  const lessonsCount = course.lessons?.length || 0;
  const quizzesCount = course.quizzes?.length || 0;

  return (
    <Card className="flex flex-col justify-between border-border/80 bg-card hover:border-primary/50 transition-all shadow-sm group">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 font-medium text-xs"
          >
            Interactive Course
          </Badge>
          {isEnrolled && (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Enrolled</span>
            </Badge>
          )}
        </div>

        <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>

        <CardDescription className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
          <span className="flex items-center gap-1.5 font-medium">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            {quizzesCount} {quizzesCount === 1 ? "Quiz" : "Quizzes"}
          </span>
        </div>

        {course.owner && (
          <div className="flex items-center gap-2 pt-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
              {course.owner.username.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {course.owner.username}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/courses/${courseDocId}`}
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full gap-2 font-semibold transition-all",
            isEnrolled
              ? "bg-primary text-white"
              : "bg-muted hover:bg-muted/80 text-foreground"
          )}
        >
          {isEnrolled ? (
            <>
              <PlayCircle className="h-4 w-4" />
              <span>Continue Learning</span>
            </>
          ) : (
            <>
              <GraduationCap className="h-4 w-4" />
              <span>View Course</span>
            </>
          )}
        </Link>
      </CardFooter>
    </Card>
  );
}
