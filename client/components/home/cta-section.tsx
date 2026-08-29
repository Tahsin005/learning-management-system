"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, GraduationCap, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const { isAuthenticated, roleType } = useAuth();

  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-card/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-[500px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-card to-background p-8 sm:p-14 text-center space-y-8 shadow-2xl relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <GraduationCap className="h-7 w-7" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to Accelerate Your Developer Journey?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Join Scholler LMS today to explore complete production-grade courses, interactive video modules, and automated assessments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                href="/courses"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base shadow-lg shadow-primary/25 gap-2 bg-primary hover:bg-primary/90 text-white font-semibold"
                )}
              >
                Browse All 10 Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 px-8 text-base shadow-lg shadow-primary/25 gap-2 bg-primary hover:bg-primary/90 text-white font-semibold"
                  )}
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 px-8 text-base border-border/80 hover:bg-muted/60"
                  )}
                >
                  Sign In (Standard Accounts)
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-4 border-t border-border/40 max-w-md mx-auto">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              100% Free Access
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Instant Auto-Grading
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
              Progress Badges
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
