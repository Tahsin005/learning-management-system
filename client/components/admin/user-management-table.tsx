"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChangeRoleModal } from "./change-role-modal";
import type { User, UserRoleType } from "@/types/auth";
import { Search, UserCog, Filter, Shield, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserManagementTableProps {
  users?: User[];
  isLoading?: boolean;
  currentAdminId?: number | string;
}

const ROLE_BADGES: Record<string, { label: string; class: string }> = {
  admin: { label: "Admin", class: "bg-red-500/10 text-red-500 border-red-500/30" },
  content_manager: { label: "Content Manager", class: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  instructor: { label: "Instructor", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  student: { label: "Student", class: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
};

export function UserManagementTable({
  users = [],
  isLoading,
  currentAdminId,
}: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const userRoleType = (u.role?.type || "student").toLowerCase();
      const matchesRole = roleFilter === "all" || userRoleType === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="bg-card border-border/60 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <UserCog className="h-4 w-4 text-primary" /> User Directory & Role Assignment
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Manage accounts, assign permissions, and promote users across the 4 LMS roles.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Total: <strong className="text-foreground">{filteredUsers.length}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-muted/30 border-border/60 focus:bg-background"
              />
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Button
                variant={roleFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoleFilter("all")}
                className="h-8 text-xs font-medium px-2.5"
              >
                All
              </Button>
              <Button
                variant={roleFilter === "admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoleFilter("admin")}
                className="h-8 text-xs font-medium px-2.5"
              >
                Admins
              </Button>
              <Button
                variant={roleFilter === "content_manager" ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoleFilter("content_manager")}
                className="h-8 text-xs font-medium px-2.5"
              >
                Managers
              </Button>
              <Button
                variant={roleFilter === "instructor" ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoleFilter("instructor")}
                className="h-8 text-xs font-medium px-2.5"
              >
                Instructors
              </Button>
              <Button
                variant={roleFilter === "student" ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoleFilter("student")}
                className="h-8 text-xs font-medium px-2.5"
              >
                Students
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading platform user directory...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">No users found</p>
              <p>Try adjusting your search query or role filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-y border-border/60 bg-muted/20 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredUsers.map((u) => {
                    const roleType = (u.role?.type || "student").toLowerCase();
                    const badge = ROLE_BADGES[roleType] || {
                      label: u.role?.name || "User",
                      class: "bg-muted text-muted-foreground",
                    };
                    const isSelf = String(u.id) === String(currentAdminId);

                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20">
                              <AvatarFallback className="text-xs font-bold text-primary">
                                {u.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {u.username}
                                {isSelf && (
                                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground">ID #{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 opacity-60" />
                            {u.email}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={cn(badge.class, "font-semibold text-[11px] px-2 py-0.5")}
                          >
                            {badge.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRoleModal(u)}
                            className="h-7 text-xs font-medium gap-1.5 border-border/80 hover:border-primary/50 hover:bg-primary/10"
                          >
                            <Shield className="h-3 w-3 text-primary" />
                            Change Role
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ChangeRoleModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAdminId={currentAdminId}
      />
    </>
  );
}
