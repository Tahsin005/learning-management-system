"use client";

import {
  Sparkles,
  Zap,
  PlaySquare,
  BarChart2,
  ShieldCheck,
  FileText,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FEATURES_LIST = [
  {
    icon: Zap,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    title: "Instant Auto-Graded Assessments",
    description:
      "Submit multiple-choice quizzes and receive real-time scores with passing threshold verification and in-depth question explanations.",
  },
  {
    icon: PlaySquare,
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    title: "HD Video & Markdown Lessons",
    description:
      "Learn via responsive YouTube video walkthroughs accompanied by syntax-highlighted GitHub Markdown notes and code snippets.",
  },
  {
    icon: BarChart2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    title: "Real-Time Progress Analytics",
    description:
      "Granular lesson completion marks, animated progress bars, and personal gradebook tracking across all enrolled courses.",
  },
  {
    icon: ShieldCheck,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "Strict Multi-Role RBAC",
    description:
      "Dedicated, isolated portals for Students, Instructors, Content Managers, and Admins with strict backend 403 policy enforcement.",
  },
  {
    icon: FileText,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    title: "Editorial Blog & Tech Insights",
    description:
      "Full editorial publishing lifecycle with Draft and Published article management, author attributions, and markdown formatting.",
  },
  {
    icon: Cpu,
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    title: "Modern Next.js 16 & Strapi v5",
    description:
      "High-speed full-stack architecture powered by Next.js Turbopack, Strapi Document Service, PostgreSQL, and TanStack React Query.",
  },
];

export function PlatformFeatures() {
  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-card/10 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for Modern Learning
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A comprehensive feature set designed to deliver seamless interactive education and streamlined content management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feature, idx) => {
            const FeatureIcon = feature.icon;

            return (
              <Card
                key={idx}
                className="border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 transition-all duration-200 shadow-sm group"
              >
                <CardHeader className="space-y-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${feature.color} transition-transform group-hover:scale-110`}
                  >
                    <FeatureIcon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
