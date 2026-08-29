import { apiClient } from "./client";
import type {
  BlogPost,
  BlogPostListResponse,
  BlogPostSingleResponse,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/types/blog";

export interface GetBlogPostsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "published" | "draft" | "all";
}

export const blogsApi = {
  async getBlogPosts(params: GetBlogPostsParams = {}): Promise<BlogPostListResponse> {
    const { page = 1, pageSize = 12, search, status } = params;
    const query = new URLSearchParams();

    query.set("pagination[page]", String(page));
    query.set("pagination[pageSize]", String(pageSize));
    query.set("populate", "*");
    query.set("sort", "createdAt:desc");

    if (search && search.trim()) {
      query.set("filters[title][$containsi]", search.trim());
    }

    if (status === "published") {
      query.set("status", "published");
      query.set("filters[publishedAt][$notNull]", "true");
    } else if (status === "draft") {
      query.set("status", "draft");
      query.set("filters[publishedAt][$null]", "true");
    } else {
      query.set("status", "draft");
    }

    return apiClient.get<BlogPostListResponse>(`/api/blog-posts?${query.toString()}`);
  },

  async getBlogPost(idOrDocId: string): Promise<BlogPostSingleResponse> {
    return apiClient.get<BlogPostSingleResponse>(`/api/blog-posts/${idOrDocId}?populate=*`);
  },

  async createBlogPost(data: CreateBlogPostInput): Promise<BlogPostSingleResponse> {
    return apiClient.post<BlogPostSingleResponse>("/api/blog-posts", {
      data,
    });
  },

  async updateBlogPost(documentId: string, data: UpdateBlogPostInput): Promise<BlogPostSingleResponse> {
    return apiClient.put<BlogPostSingleResponse>(`/api/blog-posts/${documentId}`, {
      data,
    });
  },

  async deleteBlogPost(documentId: string): Promise<{ message: string; data: { documentId: string; id: number; title: string } }> {
    return apiClient.delete<{ message: string; data: { documentId: string; id: number; title: string } }>(`/api/blog-posts/${documentId}`);
  },
};
