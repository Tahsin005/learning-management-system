"use client";

import { FolderPlus, PenTool } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContentHeaderProps {
  onOpenNewCourse: () => void;
  onOpenNewBlog: () => void;
}

export function ContentHeader({ onOpenNewCourse, onOpenNewBlog }: ContentHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-card to-background p-6 sm:p-8 shadow-sm">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold px-2.5 py-0.5">
              Content Management Studio
            </Badge>
            <span className="text-xs text-muted-foreground">Platform-Wide Authority</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Curate, Publish & Orchestrate Learning
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Create and manage all courses and curriculum across the platform, author editorial blog posts, and monitor global student learning outcomes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={onOpenNewCourse}
            className="font-semibold shadow-md gap-1.5 rounded-xl h-10 px-4"
          >
            <FolderPlus className="h-4 w-4" />
            New Course
          </Button>
          <Button
            onClick={onOpenNewBlog}
            variant="outline"
            className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-semibold gap-1.5 rounded-xl h-10 px-4"
          >
            <PenTool className="h-4 w-4" />
            New Blog Article
          </Button>
        </div>
      </div>
    </div>
  );
}
