"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateUserRoleMutation } from "@/hooks/queries/use-admin-queries";
import type { User, UserRoleType } from "@/types/auth";
import { Shield, ShieldAlert, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangeRoleModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  currentAdminId?: number | string;
}

const ROLES_INFO: Array<{
  type: UserRoleType;
  title: string;
  badgeClass: string;
  description: string;
  permissions: string[];
}> = [
  {
    type: "admin",
    title: "Admin",
    badgeClass: "bg-red-500/10 text-red-500 border-red-500/30",
    description: "Full control of the platform. Manages users and assigns/changes their roles. Can do everything.",
    permissions: [
      "Manage all users & change roles",
      "Full CRUD on all courses, lessons, quizzes",
      "Full CRUD on all blog posts",
      "Access Admin Panel & Platform Analytics",
    ],
  },
  {
    type: "content_manager",
    title: "Content Manager",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    description: "Creates and manages courses, lessons, and blog posts across the platform. Does not manage users.",
    permissions: [
      "Create, edit, delete any course & lesson",
      "Create and edit quizzes",
      "Write, edit, publish, delete all blog posts",
      "Cannot manage users or assign roles",
    ],
  },
  {
    type: "instructor",
    title: "Instructor",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    description: "Manages the lessons and quizzes of their own courses, and can see the progress of students enrolled in them.",
    permissions: [
      "Create & manage own courses",
      "Add lessons & quizzes to own courses",
      "View enrolled students' progress in own courses",
      "Cannot write blogs or manage users",
    ],
  },
  {
    type: "student",
    title: "Student",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    description: "Enrolls in courses, views lessons, takes quizzes, and tracks their own progress.",
    permissions: [
      "Enroll in courses & track progress",
      "View sequential lessons & complete them",
      "Take MCQ quizzes with instant auto-grading",
      "Read published blog posts",
    ],
  },
];

export function ChangeRoleModal({
  user,
  isOpen,
  onClose,
  currentAdminId,
}: ChangeRoleModalProps) {
  const currentRoleType = (user?.role?.type || "student") as UserRoleType;
  const [selectedRole, setSelectedRole] = useState<UserRoleType>(currentRoleType);
  const updateRoleMutation = useUpdateUserRoleMutation();

  if (!user) return null;

  const isSelf = String(user.id) === String(currentAdminId);
  const hasChanged = selectedRole !== currentRoleType;

  const handleSave = async () => {
    if (!hasChanged) {
      onClose();
      return;
    }

    try {
      await updateRoleMutation.mutateAsync({
        userId: user.id,
        payload: { roleType: selectedRole },
      });
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border/80 sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Manage User Role
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Reassign platform role and permission level for <span className="font-semibold text-foreground">{user.username}</span> ({user.email}).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSelf && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> This is your own currently active administrator account. Self-demotion is restricted to prevent platform lockouts.
            </p>
          </div>
        )}

        <div className="space-y-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground">Select Role:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ROLES_INFO.map((r) => {
              const isSelected = selectedRole === r.type;
              const isCurrent = currentRoleType === r.type;

              return (
                <div
                  key={r.type}
                  onClick={() => !isSelf && setSelectedRole(r.type)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all relative flex flex-col justify-between space-y-2",
                    isSelf ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                      : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn(r.badgeClass, "font-bold text-[11px]")}>
                      {r.title}
                    </Badge>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                    {!isSelected && isCurrent && (
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-end gap-2 pt-2 border-t border-border/50">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={updateRoleMutation.isPending}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanged || isSelf || updateRoleMutation.isPending}
            className="bg-primary text-white font-semibold gap-1.5"
          >
            {updateRoleMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm Role Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
