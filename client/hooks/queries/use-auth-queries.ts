import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
  AuthResponse,
  RefreshTokenResponse,
  SimpleOkResponse,
  User,
} from "@/types/auth";
import type {
  ChangePasswordFormValues,
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { getCookie, COOKIE_AUTH_TOKEN } from "@/lib/cookies";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useMeQuery() {
  const { setUser, clearAuth, setInitialized, token: storeToken } = useAuthStore();
  const token = typeof window !== "undefined" ? (getCookie(COOKIE_AUTH_TOKEN) || storeToken) : null;

  return useQuery<User, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const user = await authApi.getCurrentUser();
        setUser(user);
        setInitialized(true);
        return user;
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string };
        if (err?.status === 401 || err?.message?.includes("401")) {
          clearAuth();
        }
        setInitialized(true);
        throw error;
      }
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      const err = error as { status?: number; message?: string };
      if (err?.status === 401 || err?.message?.includes("401")) return false;
      return failureCount < 2;
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginFormValues>({
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await authApi.login(credentials);
      return response;
    },
    onSuccess: async (data) => {
      setAuth(data.jwt, data.user);
      let userObj = data.user;
      try {
        const fullUser = await authApi.getCurrentUser();
        setAuth(data.jwt, fullUser);
        queryClient.setQueryData(AUTH_QUERY_KEY, fullUser);
        userObj = fullUser;
      } catch {
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
      toast.success(`Welcome back, ${data.user.username}!`);

      const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const redirectParam = urlParams?.get("redirect");

      if (redirectParam && !redirectParam.startsWith("/login")) {
        router.push(redirectParam);
        return;
      }

      const roleType = userObj.role?.type || "";
      if (roleType === "instructor") {
        router.push("/instructor");
      } else if (roleType === "admin") {
        router.push("/admin");
      } else if (roleType === "content_manager") {
        router.push("/content");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to log in. Please check your credentials.");
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, Omit<RegisterFormValues, "passwordConfirmation">>({
    mutationFn: async (credentials) => {
      const response = await authApi.register(credentials);
      return response;
    },
    onSuccess: async (data) => {
      setAuth(data.jwt, data.user);
      try {
        const fullUser = await authApi.getCurrentUser();
        setAuth(data.jwt, fullUser);
        queryClient.setQueryData(AUTH_QUERY_KEY, fullUser);
      } catch {
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation<SimpleOkResponse, Error, void>({
    mutationFn: async () => {
      return authApi.logout();
    },
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.clear();
      window.location.href = "/login";
    },
  });
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();
  const { setToken, setUser } = useAuthStore();

  return useMutation<AuthResponse, Error, ChangePasswordFormValues>({
    mutationFn: async (payload: ChangePasswordFormValues) => {
      return authApi.changePassword(payload);
    },
    onSuccess: (data) => {
      if (data?.jwt) {
        setToken(data.jwt);
      }
      if (data?.user) {
        setUser(data.user);
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change password.");
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation<SimpleOkResponse, Error, ForgotPasswordFormValues>({
    mutationFn: async (payload: ForgotPasswordFormValues) => {
      return authApi.forgotPassword(payload);
    },
    onSuccess: () => {
      toast.success("If the email exists, a password reset link or code has been sent.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process forgot password request.");
    },
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, ResetPasswordFormValues>({
    mutationFn: async (payload: ResetPasswordFormValues) => {
      return authApi.resetPassword(payload);
    },
    onSuccess: (data) => {
      if (data?.jwt && data?.user) {
        setAuth(data.jwt, data.user);
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
      toast.success("Password has been reset successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset password. Please check your reset code.");
    },
  });
}

export function useRefreshTokenMutation() {
  const { setToken } = useAuthStore();

  return useMutation<RefreshTokenResponse, Error, string | undefined>({
    mutationFn: async (refreshToken?: string) => {
      return authApi.refreshToken(refreshToken);
    },
    onSuccess: (data) => {
      if (data?.jwt) {
        setToken(data.jwt);
      }
    },
  });
}
