import { apiClient } from "@/lib/api/client";
import type { User, UserRoleType } from "@/types/auth";

export interface PlatformStats {
  totalUsers: number;
  usersByRole: {
    admin: number;
    content_manager: number;
    instructor: number;
    student: number;
    other: number;
  };
  totalCourses: number;
  totalEnrollments: number;
  totalLessons: number;
  totalQuizzes: number;
}

export interface UpdateRolePayload {
  roleType?: UserRoleType;
  roleName?: string;
  roleId?: number;
}

export interface UpdateRoleResponse {
  message: string;
  user: User;
}

export const adminApi = {
  getStats: async (): Promise<PlatformStats> => {
    return apiClient.get<PlatformStats>("/api/admin-custom/stats");
  },

  getUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>("/api/admin-custom/users");
  },

  updateUserRole: async (
    userId: number | string,
    payload: UpdateRolePayload
  ): Promise<UpdateRoleResponse> => {
    return apiClient.put<UpdateRoleResponse>(
      `/api/admin-custom/users/${userId}/role`,
      payload
    );
  },
};
