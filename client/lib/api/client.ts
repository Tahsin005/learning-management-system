import { getCookie, setCookie, removeCookie, COOKIE_AUTH_TOKEN } from "@/lib/cookies";
import type { ApiErrorResponse } from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function tryRefreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      removeCookie(COOKIE_AUTH_TOKEN);
      return null;
    }

    const data = await res.json();
    if (data?.jwt) {
      setCookie(COOKIE_AUTH_TOKEN, data.jwt);
      return data.jwt;
    }
    return null;
  } catch {
    removeCookie(COOKIE_AUTH_TOKEN);
    return null;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, skipAuth = false, headers = {}, ...restOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const currentToken = token || (!skipAuth ? getCookie(COOKIE_AUTH_TOKEN) : null);

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (currentToken && !skipAuth) {
    requestHeaders["Authorization"] = `Bearer ${currentToken}`;
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
    credentials: "include",
  });

  if (response.status === 401 && !skipAuth && !endpoint.includes("/api/auth/")) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        return request<T>(endpoint, {
          ...options,
          token: newToken,
        });
      });
    }

    isRefreshing = true;
    const newToken = await tryRefreshToken();
    isRefreshing = false;

    if (newToken) {
      processQueue(null, newToken);
      return request<T>(endpoint, {
        ...options,
        token: newToken,
      });
    } else {
      processQueue(new Error("Session expired. Please log in again."));
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
      throw new ApiError("Unauthorized", 401);
    }
  }

  let responseData: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json().catch(() => null);
  } else {
    responseData = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const errorData = responseData as ApiErrorResponse | null;
    const errorMessage =
      errorData?.error?.message ||
      errorData?.message ||
      response.statusText ||
      `Request failed with status ${response.status}`;

    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
