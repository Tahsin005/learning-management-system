"use client";

import { User, Mail, Shield, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User as UserType, Role } from "@/types/auth";

interface AccountProfileCardProps {
  user: UserType | null;
  role?: Role | null;
  roleType?: string;
}

export function AccountProfileCard({
  user,
  role,
  roleType = "",
}: AccountProfileCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Account Profile Details</CardTitle>
        <CardDescription className="text-xs">
          Your registered authentication and permission parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>Username</span>
            </div>
            <p className="font-semibold text-foreground">{user?.username}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span>Email Address</span>
            </div>
            <p className="font-semibold text-foreground">{user?.email}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>System Role</span>
            </div>
            <p className="font-semibold text-foreground capitalize">
              {role?.name || roleType || "Student"}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Last Activity</span>
            </div>
            <p className="font-semibold text-foreground">{formatDate(user?.updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
