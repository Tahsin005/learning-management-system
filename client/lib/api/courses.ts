import { apiClient } from "./client";
import type {
  Course,
  CourseProgressSummary,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/types/course";

export interface GetCoursesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}

export const coursesApi = {
  /**
   * List courses with database pagination and optional filters
   */
  async getCourses(params: GetCoursesParams = {}): Promise<StrapiListResponse<Course>> {
    const { page = 1, pageSize = 12, search } = params;
    const query = new URLSearchParams();

    query.set("pagination[page]", String(page));
    query.set("pagination[pageSize]", String(pageSize));
    query.set("populate", "*");

    if (search && search.trim()) {
      query.set("filters[title][$containsi]", search.trim());
    }

    return apiClient.get<StrapiListResponse<Course>>(`/api/courses?${query.toString()}`);
  },

  /**
   * Get single course details by documentId or id
   */
  async getCourse(documentId: string): Promise<StrapiSingleResponse<Course>> {
    return apiClient.get<StrapiSingleResponse<Course>>(`/api/courses/${documentId}?populate=*`);
  },

  /**
   * Get student course progress breakdown
   */
  async getCourseProgress(documentId: string): Promise<CourseProgressSummary> {
    return apiClient.get<CourseProgressSummary>(`/api/courses/${documentId}/progress`);
  },
};
