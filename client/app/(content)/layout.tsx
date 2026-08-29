"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, roleType, isInitialized, isLoading } = useAuth();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/content");
      return;
    }

    // Role-based protection: only content_manager and admin
    if (roleType !== "content_manager" && roleType !== "admin") {
      if (roleType === "instructor") {
        router.replace("/instructor");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, roleType, isInitialized, isLoading, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Verifying content manager access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (roleType !== "content_manager" && roleType !== "admin")) {
    return null;
  }

  return <div className="flex-1 flex flex-col">{children}</div>;
}
