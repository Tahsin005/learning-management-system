"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatsQuery, useAdminUsersQuery } from "@/hooks/queries/use-admin-queries";
import { useCoursesQuery } from "@/hooks/queries/use-course-queries";
import { useBlogPostsQuery } from "@/hooks/queries/use-blog-queries";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { GlobalCoursesTable } from "@/components/admin/global-courses-table";
import { GlobalBlogsTable } from "@/components/admin/global-blogs-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Shield,
  UserCog,
  BookOpen,
  FileText,
  FileEdit,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "courses" | "blogs">("users");

  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useAdminStatsQuery();

  const {
    data: users = [],
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useAdminUsersQuery();

  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    refetch: refetchCourses,
  } = useCoursesQuery({ page: 1, pageSize: 1000 });

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    refetch: refetchBlogs,
  } = useBlogPostsQuery({ page: 1, pageSize: 1000 });

  const handleRefreshAll = () => {
    refetchStats();
    refetchUsers();
    refetchCourses();
    refetchBlogs();
  };

  const isRefreshing = isStatsRefetching;

  return (
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 gap-1 font-bold text-xs">
              <Shield className="h-3.5 w-3.5" /> Platform Governance
            </Badge>
            <span className="text-xs text-muted-foreground">• Full Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            Admin Panel
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Welcome back, <strong className="text-foreground">{user?.username}</strong>. Monitor platform health, assign user roles, and govern the course and blog library.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="h-9 text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            Sync Platform
          </Button>

          <Link
            href="/content"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 text-xs font-semibold gap-1.5 bg-primary text-white hover:bg-primary/90"
            )}
          >
            <FileEdit className="h-3.5 w-3.5" /> Content Studio
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Live Platform Metrics
        </h2>
        <AdminStatsCards stats={stats} isLoading={isStatsLoading} />
      </section>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("users")}
            className="text-xs font-semibold gap-1.5"
          >
            <UserCog className="h-3.5 w-3.5" />
            <span>User Management</span>
            {users.length > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                {users.length}
              </Badge>
            )}
          </Button>

          <Button
            variant={activeTab === "courses" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("courses")}
            className="text-xs font-semibold gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Course Catalog</span>
            {coursesData?.data && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                {coursesData.data.length}
              </Badge>
            )}
          </Button>

          <Button
            variant={activeTab === "blogs" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("blogs")}
            className="text-xs font-semibold gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Blog Publications</span>
            {blogsData?.data && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                {blogsData.data.length}
              </Badge>
            )}
          </Button>
        </div>

        {activeTab === "users" && (
          <UserManagementTable
            users={users}
            isLoading={isUsersLoading}
            currentAdminId={user?.id}
          />
        )}

        {activeTab === "courses" && (
          <GlobalCoursesTable
            courses={coursesData?.data || []}
            isLoading={isCoursesLoading}
          />
        )}

        {activeTab === "blogs" && (
          <GlobalBlogsTable
            blogs={blogsData?.data || []}
            isLoading={isBlogsLoading}
          />
        )}
      </div>
    </main>
  );
}
