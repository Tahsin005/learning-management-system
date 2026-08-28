import { apiClient } from "./client";
import type {
  Quiz,
  QuizResultRecord,
  QuizSubmissionPayload,
  QuizSubmissionResponse,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/types/course";

export const quizzesApi = {
  /**
   * Get single quiz by documentId (questions are sanitized by anti-cheat shield for students)
   */
  async getQuiz(documentId: string): Promise<StrapiSingleResponse<Quiz>> {
    return apiClient.get<StrapiSingleResponse<Quiz>>(`/api/quizzes/${documentId}?populate=*`);
  },

  /**
   * List quizzes for a specific course
   */
  async getQuizzesByCourse(courseDocId: string): Promise<StrapiListResponse<Quiz>> {
    const query = new URLSearchParams({
      "filters[course][documentId][$eq]": courseDocId,
      populate: "*",
    });

    return apiClient.get<StrapiListResponse<Quiz>>(`/api/quizzes?${query.toString()}`);
  },

  /**
   * Submit quiz answers for instant auto-grading
   */
  async submitQuiz(payload: QuizSubmissionPayload): Promise<QuizSubmissionResponse> {
    return apiClient.post<QuizSubmissionResponse>("/api/quiz-results/submit", {
      data: payload,
    });
  },

  /**
   * Get all quiz results for the currently logged-in student
   */
  async getMyQuizResults(page = 1, pageSize = 25): Promise<StrapiListResponse<QuizResultRecord>> {
    const query = new URLSearchParams({
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
      populate: "*",
      sort: "submittedAt:desc",
    });

    return apiClient.get<StrapiListResponse<QuizResultRecord>>(`/api/quiz-results?${query.toString()}`);
  },

  /**
   * Get single quiz result details
   */
  async getQuizResult(documentId: string): Promise<StrapiSingleResponse<QuizResultRecord>> {
    return apiClient.get<StrapiSingleResponse<QuizResultRecord>>(`/api/quiz-results/${documentId}?populate=*`);
  },
};
