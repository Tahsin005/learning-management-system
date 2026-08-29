"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Users,
  ShieldCheck,
  LayoutDashboard,
  Flame,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { isAuthenticated, roleType, user } = useAuth();

  const getDashboardHref = () => {
    switch (roleType) {
      case "admin":
        return "/admin";
      case "content_manager":
        return "/content/blogs";
      case "instructor":
        return "/instructor/courses";
      case "student":
      default:
        return "/dashboard";
    }
  };

  const getDashboardLabel = () => {
    switch (roleType) {
      case "admin":
        return "Admin Control Panel";
      case "content_manager":
        return "Editorial Studio";
      case "instructor":
        return "Instructor Studio";
      case "student":
      default:
        return "My Learning Dashboard";
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.2),rgba(255,255,255,0))]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary shadow-sm backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Next-Gen Full-Stack Learning Management System</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div className="space-y-4 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Master In-Demand Tech &{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Elevate Your Career
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Hands-on software engineering courses with embedded HD video walkthroughs,
            GitHub-flavored Markdown lessons, auto-graded interactive assessments, and real-time skill analytics.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <>
              <Link
                href={getDashboardHref()}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base shadow-lg shadow-primary/25 gap-2.5 bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02]"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                {getDashboardLabel()}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-8 text-base border-border/80 hover:bg-muted/60 transition-all"
                )}
              >
                Browse All Courses
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/courses"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base shadow-lg shadow-primary/25 gap-2 bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-[1.02]"
                )}
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-8 text-base border-border/80 hover:bg-muted/60 transition-all font-medium"
                )}
              >
                Create Free Account
              </Link>
            </>
          )}
        </div>

        <div className="pt-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md shadow-sm">
            <div className="flex flex-col items-center justify-center p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>10+</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">Production Courses</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 space-y-1 border-l border-border/40">
              <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>20+</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">Interactive Lessons</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 space-y-1 border-t md:border-t-0 md:border-l border-border/40">
              <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-foreground">
                <Flame className="h-5 w-5 text-amber-400" />
                <span>100%</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">Auto-Graded Quizzes</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 space-y-1 border-t md:border-t-0 md:border-l border-border/40">
              <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-foreground">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                <span>4 Roles</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">Full RBAC Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
