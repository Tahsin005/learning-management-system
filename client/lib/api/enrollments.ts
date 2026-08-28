import { apiClient } from "./client";
import type {
  Enrollment,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/types/course";

export interface EnrollCourseResponse {
  message: string;
  data: Enrollment;
}

export const enrollmentsApi = {
  /**
   * Enroll the currently logged-in student in a course
   */
  async enroll(courseDocId: string): Promise<EnrollCourseResponse> {
    return apiClient.post<EnrollCourseResponse>("/api/enrollments", {
      data: {
        course: courseDocId,
      },
    });
  },

  /**
   * List all enrollments for the currently logged-in user
   */
  async getMyEnrollments(page = 1, pageSize = 25): Promise<StrapiListResponse<Enrollment>> {
    const query = new URLSearchParams({
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
      populate: "*",
      sort: "createdAt:desc",
    });

    return apiClient.get<StrapiListResponse<Enrollment>>(`/api/enrollments?${query.toString()}`);
  },

  /**
   * Get single enrollment details
   */
  async getEnrollment(documentId: string): Promise<StrapiSingleResponse<Enrollment>> {
    return apiClient.get<StrapiSingleResponse<Enrollment>>(`/api/enrollments/${documentId}?populate=*`);
  },
};
