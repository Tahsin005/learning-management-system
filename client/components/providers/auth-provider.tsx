"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { GraduationCap, Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isInitialized, token, user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setMinDelayPassed(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const isAuthResolving = !mounted || !isInitialized || (!!token && !user && isLoading);
  const showGlobalLoader = isAuthResolving || !minDelayPassed;

  if (showGlobalLoader) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-300">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_45%,rgba(37,99,235,0.18),rgba(0,0,0,0))]" />
        
        <div className="flex flex-col items-center space-y-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="relative">
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/35 ring-2 ring-primary/50 animate-pulse">
              <GraduationCap className="h-12 w-12 sm:h-14 sm:w-14" />
            </div>
            <div className="absolute -inset-4 -z-10 rounded-full bg-primary/20 blur-2xl animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Scholler
            </h1>
            <div className="flex items-center justify-center gap-2.5 text-sm sm:text-base text-muted-foreground">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
              <span>Verifying secure session...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
