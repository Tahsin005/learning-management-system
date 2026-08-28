"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const { user, roleType, isAuthenticated, isLoading, isInitialized, logout, isLoggingOut } = useAuth();

  const getRoleBadge = () => {
    switch (roleType) {
      case "admin":
        return (
          <Badge variant="outline" className="h-5 px-2 text-[10px] font-semibold border-amber-500/40 text-amber-400 bg-amber-500/10">
            Admin
          </Badge>
        );
      case "content_manager":
        return (
          <Badge variant="outline" className="h-5 px-2 text-[10px] font-semibold border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
            Content Manager
          </Badge>
        );
      case "instructor":
        return (
          <Badge variant="outline" className="h-5 px-2 text-[10px] font-semibold border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
            Instructor
          </Badge>
        );
      case "student":
        return (
          <Badge variant="outline" className="h-5 px-2 text-[10px] font-semibold border-blue-500/40 text-blue-400 bg-blue-500/10">
            Student
          </Badge>
        );
      default:
        return null;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  const renderAuthActions = () => {
    if (!isInitialized || isLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 rounded-full bg-muted/40 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
        </div>
      );
    }

    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full border border-border/80 bg-card/90 py-1 pl-2.5 pr-1.5 shadow-sm hover:border-primary/50 hover:bg-card transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {getRoleBadge()}
            <span className="text-xs font-semibold text-foreground max-w-[120px] truncate hidden sm:inline-block">
              {user.username}
            </span>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-[11px] shadow-sm ring-1 ring-white/10">
              {getInitials(user.username)}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors mr-0.5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 p-1.5">
            <DropdownMenuLabel className="font-normal px-2.5 py-2">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold leading-none text-foreground truncate">{user.username}</p>
                  {getRoleBadge()}
                </div>
                <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer gap-2"
              >
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="cursor-pointer gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
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
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Scholler
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {renderAuthActions()}
        </div>
      </div>
    </header>
  );
}
