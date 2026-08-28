export type UserRoleType = "admin" | "content_manager" | "instructor" | "student";

export interface UserRole {
  id: number;
  documentId: string;
  name: string;
  description: string;
  type: UserRoleType;
}

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  role?: UserRole;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface RefreshTokenResponse {
  jwt: string;
}

export interface SimpleOkResponse {
  ok: boolean;
  message?: string;
}

export interface ApiErrorResponse {
  data?: null;
  error?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
  message?: string;
}
