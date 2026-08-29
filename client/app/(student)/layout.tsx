"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, roleType, isAuthenticated, isInitialized, isLoading } = useAuth();

  useEffect(() => {
    if (isInitialized && isAuthenticated && roleType && !["student", "admin"].includes(roleType)) {
      if (roleType === "instructor") {
        router.replace("/instructor");
      } else if (roleType === "content_manager") {
        router.replace("/content");
      } else {
        router.replace("/courses");
      }
    }
  }, [isInitialized, isAuthenticated, roleType, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Verifying student credentials...</p>
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
            Please log in to access your student dashboard, courses, and assessment records.
          </p>
        </div>
        <Link
          href="/login?redirect=/dashboard"
          className={cn(buttonVariants({ size: "sm" }), "bg-primary text-white font-semibold")}
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (roleType && !["student", "admin"].includes(roleType)) {
    const getDestination = () => {
      if (roleType === "instructor") return { name: "Instructor Studio", href: "/instructor" };
      if (roleType === "content_manager") return { name: "Content Studio", href: "/content" };
      return { name: "Course Catalog", href: "/courses" };
    };

    const dest = getDestination();

    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-foreground">Redirecting to Staff Workspace...</h2>
          <p className="text-xs text-muted-foreground">
            Opening {dest.name} for your <span className="capitalize">{roleType.replace("_", " ")}</span> account.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
