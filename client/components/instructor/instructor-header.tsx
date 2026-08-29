"use client";

import { Briefcase, PlusCircle, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User, Role } from "@/types/auth";

interface InstructorHeaderProps {
  user: User | null;
  role?: Role | null;
  roleType?: string;
  onOpenCreateCourse: () => void;
}

export function InstructorHeader({
  user,
  role,
  roleType = "",
  onOpenCreateCourse,
}: InstructorHeaderProps) {
  const getRoleBadge = () => {
    switch (roleType) {
      case "admin":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">Admin Studio</Badge>;
      case "instructor":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">Instructor Faculty</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{role?.name || "Faculty"}</Badge>;
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/60 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <Briefcase className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {user?.username}
              </h1>
              {getRoleBadge()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <Button
            onClick={onOpenCreateCourse}
            className="gap-2 bg-primary text-white font-semibold text-xs h-10 px-4 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Course</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
