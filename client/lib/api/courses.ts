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

export interface CreateCourseInput {
  title: string;
  description: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
}

export const coursesApi = {
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

  async getCourse(documentId: string): Promise<StrapiSingleResponse<Course>> {
    return apiClient.get<StrapiSingleResponse<Course>>(`/api/courses/${documentId}?populate=*`);
  },

  async getCourseProgress(documentId: string): Promise<CourseProgressSummary> {
    return apiClient.get<CourseProgressSummary>(`/api/courses/${documentId}/progress`);
  },

  async createCourse(data: CreateCourseInput): Promise<StrapiSingleResponse<Course>> {
    return apiClient.post<StrapiSingleResponse<Course>>("/api/courses", {
      data,
    });
  },

  async updateCourse(documentId: string, data: UpdateCourseInput): Promise<StrapiSingleResponse<Course>> {
    return apiClient.put<StrapiSingleResponse<Course>>(`/api/courses/${documentId}`, {
      data,
    });
  },

  async deleteCourse(documentId: string): Promise<{ data: Course }> {
    return apiClient.delete<{ data: Course }>(`/api/courses/${documentId}`);
  },

  async getInstructorCourses(userId?: number | string, params: GetCoursesParams = {}): Promise<StrapiListResponse<Course>> {
    const { page = 1, pageSize = 25, search } = params;
    const query = new URLSearchParams();

    query.set("pagination[page]", String(page));
    query.set("pagination[pageSize]", String(pageSize));
    query.set("populate", "*");
    query.set("sort", "createdAt:desc");

    if (userId) {
      query.set("filters[owner][id][$eq]", String(userId));
    }

    if (search && search.trim()) {
      query.set("filters[title][$containsi]", search.trim());
    }

    return apiClient.get<StrapiListResponse<Course>>(`/api/courses?${query.toString()}`);
  },
};
