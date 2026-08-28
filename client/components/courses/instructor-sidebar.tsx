"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseOwner } from "@/types/course";

interface InstructorSidebarProps {
  owner?: CourseOwner | null;
}

export function InstructorSidebar({ owner }: InstructorSidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Lead Instructor
          </span>
          <CardTitle className="text-lg font-bold text-foreground">
            {owner?.username || "Scholler Faculty"}
          </CardTitle>
          {owner?.email && (
            <p className="text-xs text-muted-foreground">{owner.email}</p>
          )}
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed">
          Experienced industry engineer and mentor crafting hands-on modules designed for production readiness.
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-foreground">
            What You Will Gain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Full access to all course lessons and video content</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Interactive auto-graded MCQ assessments with instant feedback</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>Real-time milestone tracking on your student dashboard</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
