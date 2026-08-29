import { apiClient } from "./client";
import type {
  Lesson,
  LessonProgress,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/types/course";

export interface UpdateLessonProgressResponse {
  message: string;
  data: LessonProgress;
}

export interface CreateLessonInput {
  title: string;
  content: string;
  videoUrl?: string | null;
  course: string;
  order?: number;
}

export interface UpdateLessonInput {
  title?: string;
  content?: string;
  videoUrl?: string | null;
  order?: number;
}

export const lessonsApi = {
  async getLesson(documentId: string): Promise<StrapiSingleResponse<Lesson>> {
    return apiClient.get<StrapiSingleResponse<Lesson>>(`/api/lessons/${documentId}?populate=*`);
  },

  async getLessonsByCourse(courseDocId: string): Promise<StrapiListResponse<Lesson>> {
    const query = new URLSearchParams({
      "filters[course][documentId][$eq]": courseDocId,
      populate: "*",
      sort: "order:asc",
    });

    return apiClient.get<StrapiListResponse<Lesson>>(`/api/lessons?${query.toString()}`);
  },

  async createLesson(data: CreateLessonInput): Promise<StrapiSingleResponse<Lesson>> {
    return apiClient.post<StrapiSingleResponse<Lesson>>("/api/lessons", {
      data,
    });
  },

  async updateLesson(documentId: string, data: UpdateLessonInput): Promise<StrapiSingleResponse<Lesson>> {
    return apiClient.put<StrapiSingleResponse<Lesson>>(`/api/lessons/${documentId}`, {
      data,
    });
  },

  async deleteLesson(documentId: string): Promise<{ data: Lesson }> {
    return apiClient.delete<{ data: Lesson }>(`/api/lessons/${documentId}`);
  },

  async updateProgress(lessonDocId: string, completed: boolean = true): Promise<UpdateLessonProgressResponse> {
    return apiClient.post<UpdateLessonProgressResponse>("/api/lesson-progresses", {
      data: {
        lesson: lessonDocId,
        completed,
      },
    });
  },

  async getMyProgresses(): Promise<StrapiListResponse<LessonProgress>> {
    return apiClient.get<StrapiListResponse<LessonProgress>>("/api/lesson-progresses?populate=*");
  },
};
