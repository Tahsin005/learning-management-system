"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { User, UserRoleType } from "@/types/auth";

export interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRoleType | UserRoleType[];
  ownerId?: number | string | null;
  predicate?: (user: User) => boolean;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  ownerId,
  predicate,
  requireAuth = true,
  fallback = null,
}: RoleGuardProps) {
  const { user, isAuthenticated, hasRole, isOwner } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  if (ownerId !== undefined && ownerId !== null) {
    const isSelf = isOwner(ownerId);
    if (isSelf) {
      if (predicate && user && !predicate(user)) {
        return <>{fallback}</>;
      }
      return <>{children}</>;
    }
  }

  if (allowedRoles) {
    const roleMatches = hasRole(allowedRoles);
    if (!roleMatches) {
      return <>{fallback}</>;
    }
  }

  if (predicate && user) {
    if (!predicate(user)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

export const RoleGate = RoleGuard;
export const PermissionGuard = RoleGuard;
