"use client";

import { BookOpen, FileText, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentTabsNavProps {
  activeTab: "courses" | "blogs" | "gradebook";
  onTabChange: (tab: "courses" | "blogs" | "gradebook") => void;
  totalCourses: number;
  totalBlogs: number;
  totalEnrollments: number;
}

export function ContentTabsNav({
  activeTab,
  onTabChange,
  totalCourses,
  totalBlogs,
  totalEnrollments,
}: ContentTabsNavProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-muted/60 border border-border/60">
        <button
          onClick={() => onTabChange("courses")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeTab === "courses"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Courses Library ({totalCourses})
        </button>

        <button
          onClick={() => onTabChange("blogs")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeTab === "blogs"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          Blog Editorial ({totalBlogs})
        </button>

        <button
          onClick={() => onTabChange("gradebook")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeTab === "gradebook"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          Global Gradebook ({totalEnrollments})
        </button>
      </div>
    </div>
  );
}
