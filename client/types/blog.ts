import type { PaginationMeta } from "./course";

export interface BlogAuthor {
  id: number;
  documentId?: string;
  username: string;
  email: string;
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  body: string;
  coverImageUrl?: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: BlogAuthor | null;
}

export interface BlogPostListResponse {
  data: BlogPost[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface BlogPostSingleResponse {
  data: BlogPost;
}

export interface CreateBlogPostInput {
  title: string;
  body: string;
  coverImageUrl?: string;
  isPublished?: boolean;
}

export interface UpdateBlogPostInput {
  title?: string;
  body?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
}
