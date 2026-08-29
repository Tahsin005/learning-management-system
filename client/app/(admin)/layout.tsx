"use client";

import { useAuth } from "@/hooks/use-auth";
import { Loader2, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, roleType, isAuthenticated, isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Verifying administrator credentials...</p>
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
          <h2 className="text-xl font-bold text-foreground">Admin Sign In Required</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            Please log in with an Administrator account to access the platform management console.
          </p>
        </div>
        <Link
          href="/login?redirect=/admin"
          className={cn(buttonVariants({ size: "sm" }), "bg-primary text-white font-semibold")}
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  if (roleType !== "admin") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground max-w-md">
            The Admin Panel is strictly reserved for platform administrators.
            {roleType ? (
              <> Your current account role is <strong className="text-foreground capitalize">{roleType.replace("_", " ")}</strong>.</>
            ) : (
              <> No administrator role is assigned to this account.</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs gap-1.5")}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      {children}
    </div>
  );
}
