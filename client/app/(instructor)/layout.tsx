"use client";

import { useAuth } from "@/hooks/use-auth";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, roleType, isAuthenticated, isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Verifying instructor permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">Sign In Required</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            Please log in with an Instructor or Administrator account to access the Course Studio.
          </p>
        </div>
        <Link
          href="/login?redirect=/instructor"
          className={cn(buttonVariants({ size: "sm" }), "bg-primary text-white font-semibold")}
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (!roleType || !["instructor", "admin"].includes(roleType)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground max-w-md">
            The Instructor Studio is reserved for faculty instructors and administrators.
            {roleType ? (
              <> Your current account role is <strong className="text-foreground capitalize">{roleType.replace("_", " ")}</strong>.</>
            ) : (
              <> No supported role is assigned to this account.</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "sm" }), "bg-primary text-white font-semibold")}
          >
            Go to Student Dashboard
          </Link>
          <Link
            href="/courses"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
