"use client";

import Link from "next/link";
import { GraduationCap, Mail, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User, Role } from "@/types/auth";

interface DashboardHeaderProps {
  user: User | null;
  role?: Role | null;
  roleType?: string;
}

export function DashboardHeader({ user, role, roleType = "" }: DashboardHeaderProps) {
  const getRoleBadge = () => {
    switch (roleType) {
      case "admin":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">Admin</Badge>;
      case "content_manager":
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">Content Manager</Badge>;
      case "instructor":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">Instructor</Badge>;
      case "student":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">Student</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{role?.name || "User"}</Badge>;
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/60 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <GraduationCap className="h-8 w-8" />
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
          <Link
            href="/courses"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5 bg-primary text-white font-semibold shadow-sm text-xs")}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
