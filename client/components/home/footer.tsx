"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 text-foreground py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="tracking-tight">Scholler LMS</span>
            </Link>
            <span className="hidden sm:inline-block text-border/80">|</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                Next.js 16
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                Strapi v5
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                PostgreSQL
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/courses" className="hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-foreground transition-colors">
              Register
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Scholler LMS. All rights reserved.</p>
          <p className="text-muted-foreground/80">Built with Next.js 16, Strapi v5 & PostgreSQL.</p>
        </div>
      </div>
    </footer>
  );
}
