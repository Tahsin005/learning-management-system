"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRegisterMutation,
  useResetPasswordMutation,
} from "@/hooks/queries/use-auth-queries";
import type { UserRoleType } from "@/types/auth";
import type { LoginFormValues, RegisterFormValues, ChangePasswordFormValues, ForgotPasswordFormValues, ResetPasswordFormValues } from "@/lib/validations/auth";
import { getCookie, COOKIE_AUTH_TOKEN } from "@/lib/cookies";

export function useAuth() {
  const store = useAuthStore();
  const meQuery = useMeQuery();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const token = store.token || (typeof window !== "undefined" ? getCookie(COOKIE_AUTH_TOKEN) : null);
  const user = meQuery.data || store.user;
  const role = user?.role;
  const roleType = (role?.type || (typeof role === "string" ? role : undefined)) as UserRoleType | undefined;

  const isAdmin = roleType === "admin";
  const isContentManager = roleType === "content_manager";
  const isInstructor = roleType === "instructor";
  const isStudent = roleType === "student";

  const hasRole = useMemo(() => {
    return (allowedRoles: UserRoleType | UserRoleType[]) => {
      if (!roleType) return false;
      if (Array.isArray(allowedRoles)) {
        return allowedRoles.includes(roleType);
      }
      return roleType === allowedRoles;
    };
  }, [roleType]);

  const isOwner = useMemo(() => {
    return (ownerId?: number | string | null) => {
      if (!user || ownerId === undefined || ownerId === null) return false;
      return (
        user.id === ownerId ||
        user.documentId === String(ownerId) ||
        String(user.id) === String(ownerId)
      );
    };
  }, [user]);

  const isAuthenticated = !!token && !!user;
  const isLoading = !store.isInitialized || (!!token && !user && meQuery.isLoading);

  const login = (values: LoginFormValues, onSuccess?: () => void) => {
    loginMutation.mutate(values, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const register = (values: Omit<RegisterFormValues, "passwordConfirmation">, onSuccess?: () => void) => {
    registerMutation.mutate(values, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const logout = (onSuccess?: () => void) => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const changePassword = (values: ChangePasswordFormValues, onSuccess?: () => void) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const forgotPassword = (values: ForgotPasswordFormValues, onSuccess?: () => void) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const resetPassword = (values: ResetPasswordFormValues, onSuccess?: () => void) => {
    resetPasswordMutation.mutate(values, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return {
    user,
    token,
    role,
    roleType,
    isAdmin,
    isContentManager,
    isInstructor,
    isStudent,
    hasRole,
    isOwner,
    isSelf: isOwner,
    isAuthenticated,
    isLoading,
    isInitialized: store.isInitialized,

    login,
    register,
    logout,
    clearAuth: store.clearAuth,
    changePassword,
    forgotPassword,
    resetPassword,
    refetchUser: meQuery.refetch,

    loginAsync: loginMutation.mutateAsync,
    registerAsync: registerMutation.mutateAsync,
    logoutAsync: logoutMutation.mutateAsync,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isRequestingReset: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isForgotPasswordSuccess: forgotPasswordMutation.isSuccess,
  };
}
