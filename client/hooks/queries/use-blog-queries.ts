"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogsApi, type GetBlogPostsParams } from "@/lib/api/blogs";
import type {
  BlogPost,
  BlogPostListResponse,
  BlogPostSingleResponse,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/types/blog";
import { toast } from "sonner";

export const BLOG_QUERY_KEYS = {
  all: ["blogs"] as const,
  list: (params: GetBlogPostsParams) => ["blogs", "list", params] as const,
  detail: (idOrDocId: string) => ["blogs", "detail", idOrDocId] as const,
};

export function useBlogPostsQuery(params: GetBlogPostsParams = {}, enabled = true) {
  return useQuery<BlogPostListResponse, Error>({
    queryKey: BLOG_QUERY_KEYS.list(params),
    queryFn: () => blogsApi.getBlogPosts(params),
    enabled,
    staleTime: 1000 * 30,
  });
}

export function useBlogPostQuery(idOrDocId: string, enabled = true) {
  return useQuery<BlogPostSingleResponse, Error>({
    queryKey: BLOG_QUERY_KEYS.detail(idOrDocId),
    queryFn: () => blogsApi.getBlogPost(idOrDocId),
    enabled: !!idOrDocId && enabled,
    staleTime: 1000 * 60,
  });
}

export function useCreateBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation<BlogPostSingleResponse, Error, CreateBlogPostInput>({
    mutationFn: (data) => blogsApi.createBlogPost(data),
    onSuccess: (res) => {
      const isDraft = !res.data.publishedAt;
      toast.success(
        isDraft
          ? `Draft article "${res.data.title}" saved successfully!`
          : `Article "${res.data.title}" published successfully!`
      );
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.all });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create blog post.");
    },
  });
}

export function useUpdateBlogMutation(docId?: string) {
  const queryClient = useQueryClient();

  return useMutation<
    BlogPostSingleResponse,
    Error,
    { documentId: string; data: UpdateBlogPostInput }
  >({
    mutationFn: ({ documentId, data }) => blogsApi.updateBlogPost(documentId, data),
    onSuccess: (res, variables) => {
      toast.success("Blog post updated successfully!");
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: BLOG_QUERY_KEYS.detail(variables.documentId),
      });
      if (docId) {
        queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.detail(docId) });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update blog post.");
    },
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; data: { documentId: string; id: number; title: string } },
    Error,
    string
  >({
    mutationFn: (documentId) => blogsApi.deleteBlogPost(documentId),
    onSuccess: () => {
      toast.success("Blog post deleted successfully.");
      queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.all });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete blog post.");
    },
  });
}
