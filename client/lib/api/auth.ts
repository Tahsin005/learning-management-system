import { apiClient } from "@/lib/api/client";
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

export const authApi = {
  register: async (credentials: Omit<RegisterFormValues, "passwordConfirmation">): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/api/auth/local/register", {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    }, { skipAuth: true });
  },

  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/api/auth/local", {
      identifier: credentials.identifier,
      password: credentials.password,
    }, { skipAuth: true });
  },

  refreshToken: async (refreshToken?: string): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>(
      "/api/auth/refresh",
      refreshToken ? { refreshToken } : {},
      { skipAuth: true }
    );
  },

  changePassword: async (payload: ChangePasswordFormValues): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/api/auth/change-password", {
      currentPassword: payload.currentPassword,
      password: payload.password,
      passwordConfirmation: payload.passwordConfirmation,
    });
  },

  forgotPassword: async (payload: ForgotPasswordFormValues): Promise<SimpleOkResponse> => {
    return apiClient.post<SimpleOkResponse>("/api/auth/forgot-password", {
      email: payload.email,
    }, { skipAuth: true });
  },

  resetPassword: async (payload: ResetPasswordFormValues): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/api/auth/reset-password", {
      code: payload.code,
      password: payload.password,
      passwordConfirmation: payload.passwordConfirmation,
    }, { skipAuth: true });
  },

  logout: async (): Promise<SimpleOkResponse> => {
    return apiClient.post<SimpleOkResponse>("/api/auth/logout", {});
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>("/api/users/me?populate=role");
  },
};
