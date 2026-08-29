"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  type PlatformStats,
  type UpdateRolePayload,
  type UpdateRoleResponse,
} from "@/lib/api/admin";
import type { User } from "@/types/auth";
import { toast } from "sonner";

export const ADMIN_QUERY_KEYS = {
  stats: ["admin", "stats"] as const,
  users: ["admin", "users"] as const,
};

export function useAdminStatsQuery(enabled = true) {
  return useQuery<PlatformStats, Error>({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: () => adminApi.getStats(),
    enabled,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAdminUsersQuery(enabled = true) {
  return useQuery<User[], Error>({
    queryKey: ADMIN_QUERY_KEYS.users,
    queryFn: () => adminApi.getUsers(),
    enabled,
    staleTime: 1000 * 15, // 15 seconds
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRoleResponse,
    Error,
    { userId: number | string; payload: UpdateRolePayload }
  >({
    mutationFn: ({ userId, payload }) => adminApi.updateUserRole(userId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "User role updated successfully.");
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user role.");
    },
  });
}
