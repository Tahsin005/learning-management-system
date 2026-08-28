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

export const lessonsApi = {
  /**
   * Get lesson by documentId (requires enrollment for full content)
   */
  async getLesson(documentId: string): Promise<StrapiSingleResponse<Lesson>> {
    return apiClient.get<StrapiSingleResponse<Lesson>>(`/api/lessons/${documentId}?populate=*`);
  },

  /**
   * List lessons for a specific course
   */
  async getLessonsByCourse(courseDocId: string): Promise<StrapiListResponse<Lesson>> {
    const query = new URLSearchParams({
      "filters[course][documentId][$eq]": courseDocId,
      populate: "*",
      sort: "order:asc",
    });

    return apiClient.get<StrapiListResponse<Lesson>>(`/api/lessons?${query.toString()}`);
  },

  /**
   * Update lesson progress (mark completed / incomplete)
   */
  async updateProgress(lessonDocId: string, completed: boolean = true): Promise<UpdateLessonProgressResponse> {
    return apiClient.post<UpdateLessonProgressResponse>("/api/lesson-progresses", {
      data: {
        lesson: lessonDocId,
        completed,
      },
    });
  },

  /**
   * Get all lesson progress records for the current student
   */
  async getMyProgresses(): Promise<StrapiListResponse<LessonProgress>> {
    return apiClient.get<StrapiListResponse<LessonProgress>>("/api/lesson-progresses?populate=*");
  },
};
