"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Course } from "@/types/course";
import { BookOpen, Search, ExternalLink, User, Layers, HelpCircle, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalCoursesTableProps {
  courses?: Course[];
  isLoading?: boolean;
}

export function GlobalCoursesTable({
  courses = [],
  isLoading,
}: GlobalCoursesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [courses, searchQuery]);

  return (
    <Card className="bg-card border-border/60 shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Platform Curriculum Oversight
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Global catalog of courses across all instructors with direct administration access.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Courses: <strong className="text-foreground">{filteredCourses.length}</strong>
            </span>
          </div>
        </div>

        <div className="pt-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by title or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/30 border-border/60 focus:bg-background"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading platform course catalog...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">No courses found</p>
            <p>Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-border/60 bg-muted/20 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Instructor (Owner)</th>
                  <th className="py-3 px-4">Curriculum Stats</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredCourses.map((c) => {
                  const lessonsCount = Array.isArray(c.lessons) ? c.lessons.length : 0;
                  const quizzesCount = Array.isArray(c.quizzes) ? c.quizzes.length : 0;

                  return (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground max-w-xs truncate">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-xs mt-0.5">
                          ID: {c.documentId || c.id}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {c.owner?.username || "—"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {c.owner?.email || "No email assigned"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-muted/40 text-foreground border-border text-[10px] gap-1">
                            <Layers className="h-2.5 w-2.5" /> {lessonsCount} Lessons
                          </Badge>
                          <Badge variant="outline" className="bg-muted/40 text-foreground border-border text-[10px] gap-1">
                            <HelpCircle className="h-2.5 w-2.5" /> {quizzesCount} Quizzes
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/courses/${c.documentId || c.id}`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "sm" }),
                              "h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Link>
                          <Link
                            href={`/instructor/courses/${c.documentId || c.id}`}
                            className={cn(
                              buttonVariants({ variant: "outline", size: "sm" }),
                              "h-7 text-xs px-2.5 gap-1 border-border/80 hover:border-primary/50 hover:bg-primary/10"
                            )}
                          >
                            <Edit className="h-3 w-3 text-primary" />
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
