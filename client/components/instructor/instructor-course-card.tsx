"use client";

import Link from "next/link";
import { BookOpen, Layers, Users, ExternalLink, Settings, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

interface InstructorCourseCardProps {
  course: Course;
  enrolledCount?: number;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function InstructorCourseCard({
  course,
  enrolledCount = 0,
  onEdit,
  onDelete,
}: InstructorCourseCardProps) {
  const courseDocId = course.documentId || course.id;
  const lessonsCount = course.lessons?.length || 0;
  const quizzesCount = course.quizzes?.length || 0;

  return (
    <Card className="flex flex-col justify-between border-border/80 bg-card hover:border-emerald-500/40 transition-all shadow-sm group">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium text-xs"
          >
            Authoring Course
          </Badge>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(course)}
              title="Edit Course Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(course)}
              title="Delete Course"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>

        <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/40 text-center text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground block font-medium">Lessons</span>
            <span className="font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
              <BookOpen className="h-3 w-3 text-primary" />
              {lessonsCount}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground block font-medium">Quizzes</span>
            <span className="font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
              <Layers className="h-3 w-3 text-indigo-400" />
              {quizzesCount}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground block font-medium">Students</span>
            <span className="font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
              <Users className="h-3 w-3 text-emerald-400" />
              {enrolledCount}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        <Link
          href={`/instructor/courses/${courseDocId}`}
          className={cn(
            buttonVariants({ size: "sm" }),
            "flex-1 gap-2 bg-primary text-white font-semibold text-xs shadow-sm"
          )}
        >
          <span>Manage in Studio</span>
        </Link>
        <Link
          href={`/courses/${courseDocId}`}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "text-xs px-2.5 text-muted-foreground hover:text-foreground"
          )}
          title="Preview Student View"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
