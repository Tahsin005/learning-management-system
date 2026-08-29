"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  FileEdit,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleFeature {
  id: string;
  name: string;
  badge: string;
  icon: typeof GraduationCap;
  color: string;
  tagline: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const ROLES_DATA: RoleFeature[] = [
  {
    id: "student",
    name: "Student",
    badge: "Learner Experience",
    icon: GraduationCap,
    color: "from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30",
    tagline: "Engage, Practice & Track Personal Growth",
    description:
      "A distraction-free student portal built for deep focus, structured module progression, and automated skill verification.",
    features: [
      "Dynamic Lesson Player with synchronized HD video and rich markdown notes",
      "Instant Auto-Grading Engine with passing thresholds and detailed review explanations",
      "Personal Student Dashboard with real-time course progress tracking and enrolled paths",
      "Comprehensive Gradebook with complete quiz submission score history",
    ],
    ctaLabel: "Explore Student Experience",
    ctaHref: "/courses",
  },
  {
    id: "instructor",
    name: "Instructor",
    badge: "Authoring & Telemetry",
    icon: Briefcase,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    tagline: "Build High-Impact Courses & Grade Students",
    description:
      "A complete authoring studio giving educators full control over lesson ordering, multimedia resources, and student gradebooks.",
    features: [
      "Course Studio with instant creation, editing, and thumbnail management",
      "Lesson Builder with YouTube video embeds and GitHub-flavored markdown editor",
      "Quiz Creator with multiple-choice questions, options, and passing score configuration",
      "Live Student Gradebook & Telemetry to monitor student completion rates and test scores",
    ],
    ctaLabel: "Explore Instructor Studio",
    ctaHref: "/instructor/courses",
  },
  {
    id: "content_manager",
    name: "Content Manager",
    badge: "Editorial & Publishing",
    icon: FileEdit,
    color: "from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30",
    tagline: "Curate Editorial Tech Articles & Knowledge",
    description:
      "Dedicated publishing suite for technical writers to draft, edit, preview, and publish rich markdown blog posts with author attribution.",
    features: [
      "Editorial Blog Dashboard with Draft vs. Published lifecycle management",
      "Rich-text Markdown Editor with live preview and code syntax formatting",
      "Author Attribution & Tagging across engineering topics (React, Next.js, DevOps)",
      "Instant One-Click Publish & Unpublish controls for rapid release schedules",
    ],
    ctaLabel: "Explore Editorial Studio",
    ctaHref: "/content/blogs",
  },
  {
    id: "admin",
    name: "Platform Admin",
    badge: "Governance & Security",
    icon: ShieldCheck,
    color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    tagline: "Platform-Wide Control, RBAC & Telemetry",
    description:
      "Enterprise command center for platform administrators to monitor health metrics, enforce security policies, and manage users.",
    features: [
      "Global Telemetry Dashboard (Total Courses, Lessons, Quizzes, Articles, Users, Pass Rate)",
      "User Management Table with instant Role Mutation (Student ↔ Instructor ↔ Content Manager ↔ Admin)",
      "Global Course & Blog Catalogs with search, bulk inspection, and administrative overrides",
      "Strict Server-Side RBAC Enforcement across all API controllers and mutation endpoints",
    ],
    ctaLabel: "Explore Admin Portal",
    ctaHref: "/admin",
  },
];

export function RoleShowcase() {
  const [selectedRole, setSelectedRole] = useState<string>("student");
  const activeRole = ROLES_DATA.find((r) => r.id === selectedRole) || ROLES_DATA[0];
  const IconComponent = activeRole.icon;

  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Multi-Role Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Tailored Experiences for Every Role
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Built from the ground up with 4 specialized role workflows, ensuring learners, instructors, editors, and administrators have dedicated tools.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {ROLES_DATA.map((role) => {
            const isSelected = selectedRole === role.id;
            const RoleIcon = role.icon;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all text-left group cursor-pointer",
                  isSelected
                    ? "bg-card border-primary/50 shadow-md ring-1 ring-primary/30"
                    : "bg-card/40 border-border/60 hover:bg-card/80 hover:border-border text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    isSelected
                      ? role.color
                      : "border-border/60 bg-muted/30 text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  <RoleIcon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className={cn("text-sm font-bold block", isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                    {role.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground/80 block">
                    {role.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/60 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-primary/5 blur-3xl rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs font-semibold px-2.5 py-0.5", activeRole.color)}>
                    {activeRole.name} Role
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">RBAC Protected</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {activeRole.tagline}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {activeRole.description}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {activeRole.features.map((feat, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/90 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link href={activeRole.ctaHref}>
                  <Button className="h-11 px-6 gap-2 bg-primary hover:bg-primary/90 text-white font-semibold">
                    <span>{activeRole.ctaLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="rounded-2xl border border-border/80 bg-background/80 p-6 space-y-5 shadow-inner backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", activeRole.color)}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">{activeRole.name} Dashboard</span>
                      <span className="text-[10px] text-muted-foreground">Scholler LMS v1.0</span>
                    </div>
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Access Permission</span>
                      <span className="text-emerald-400 font-semibold">Authorized</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-card/60 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Session Security</span>
                      <span className="font-bold text-foreground">JWT Token</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card/60 border border-border/40 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Data Flow</span>
                      <span className="font-bold text-foreground">REST API</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground/80 text-center italic">
                  Tested with standard role accounts (Tahsin005)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
