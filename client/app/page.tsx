import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Clock,
  Star,
  ArrowRight,
  PlayCircle,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  const featuredCourses = [
    {
      id: "1",
      title: "Full-Stack Next.js 16 & Strapi Masterclass",
      category: "Web Development",
      level: "Intermediate",
      rating: 4.9,
      reviewsCount: 320,
      duration: "24 hours",
      lessonsCount: 48,
      instructor: "Tahsin Ahamed",
      price: "$89.99",
      badge: "Bestseller",
    },
    {
      id: "2",
      title: "Advanced TypeScript & Design Patterns",
      category: "Software Engineering",
      level: "Advanced",
      rating: 4.8,
      reviewsCount: 195,
      duration: "18 hours",
      lessonsCount: 36,
      instructor: "Sarah Jenkins",
      price: "$79.99",
      badge: "Popular",
    },
    {
      id: "3",
      title: "State Management with Zustand & React Query",
      category: "Frontend",
      level: "Intermediate",
      rating: 5.0,
      reviewsCount: 142,
      duration: "12 hours",
      lessonsCount: 28,
      instructor: "Alex Rivera",
      price: "$59.99",
      badge: "Trending",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Structured Curriculum",
      description:
        "Carefully crafted modules designed by industry veterans to take you from fundamentals to production mastery.",
    },
    {
      icon: PlayCircle,
      title: "Interactive Code Labs",
      description:
        "Learn by doing with embedded exercises, hands-on tasks, and real-world project portfolios.",
    },
    {
      icon: BarChart3,
      title: "Real-time Progress Analytics",
      description:
        "Track quiz scores, completion velocity, and skill proficiency milestones with detailed dashboards.",
    },
    {
      icon: Users,
      title: "Mentor Feedback & Community",
      description:
        "Get 1-on-1 code reviews and connect with peers through live discussions and study cohorts.",
    },
    {
      icon: Award,
      title: "Verifiable Certifications",
      description:
        "Earn shareable, verified course completion certificates directly compatible with LinkedIn.",
    },
    {
      icon: ShieldCheck,
      title: "Job Placement Assistance",
      description:
        "Resume optimizations, mock technical interviews, and direct referral opportunities to hiring partners.",
    },
  ];

  const stats = [
    { value: "50,000+", label: "Enrolled Learners" },
    { value: "300+", label: "Verified Courses" },
    { value: "94%", label: "Career Placement Rate" },
    { value: "4.9 / 5.0", label: "Average Student Rating" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              EduPulse
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#courses" className="transition-colors hover:text-foreground">
              Courses
            </Link>
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#mentors" className="transition-colors hover:text-foreground">
              Mentorship
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Learning Platform for Developers</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Master Tech Skills &{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                Elevate Your Career
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Learn in-demand modern technologies with project-based curricula, real-time code reviews, and industry-recognized certifications.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#courses"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base shadow-md gap-2"
                )}
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-8 text-base"
                )}
              >
                Platform Overview
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 border-y border-border/60 py-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center justify-center p-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-3 px-3 py-1">
                Core Capabilities
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Engineered for Effective Learning
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Everything you need to go from beginner to job-ready engineer in one cohesive environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="bg-card/60 backdrop-blur-sm border-border/70 hover:border-primary/40 transition-all hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="courses" className="py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <Badge variant="outline" className="mb-3 px-3 py-1 text-primary border-primary/30">
                  Featured Programs
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Popular Learning Tracks
                </h2>
                <p className="mt-2 text-muted-foreground text-lg">
                  Hands-on courses crafted to build real-world proficiency.
                </p>
              </div>
              <Link
                href="#all-courses"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "gap-2 self-start md:self-auto"
                )}
              >
                View All Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="flex flex-col overflow-hidden border-border/70 hover:shadow-lg transition-all"
                >
                  <div className="h-44 bg-gradient-to-br from-primary/20 via-primary/5 to-muted p-6 flex flex-col justify-between relative border-b border-border/40">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="font-semibold">
                        {course.category}
                      </Badge>
                      <Badge className="bg-primary/90 text-primary-foreground">
                        {course.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.lessonsCount} lessons</span>
                    </div>
                  </div>

                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-medium mb-1">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span>{course.rating}</span>
                      <span className="text-muted-foreground text-xs">
                        ({course.reviewsCount} reviews)
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 leading-snug">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Instructor: {course.instructor}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="pt-0 border-t border-border/40 mt-auto flex items-center justify-between">
                    <div className="text-2xl font-bold text-foreground">
                      {course.price}
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "gap-1.5"
                      )}
                    >
                      Enroll Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/40 border-t border-border/50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to Level Up Your Tech Career?
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Join thousands of learners building production-ready projects and landing dream roles today.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 px-8 text-base shadow"
                    )}
                  >
                    Start Learning for Free
                  </Link>
                  <Link
                    href="#contact"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 px-8 text-base"
                    )}
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span>EduPulse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EduPulse LMS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
