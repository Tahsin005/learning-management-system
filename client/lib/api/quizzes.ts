import { apiClient } from "./client";
import type {
  Quiz,
  QuizQuestion,
  QuizResultRecord,
  QuizSubmissionPayload,
  QuizSubmissionResponse,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/types/course";

export interface CreateQuizInput {
  title: string;
  course: string;
  questions: Omit<QuizQuestion, "id">[];
}

export interface UpdateQuizInput {
  title?: string;
  questions?: Omit<QuizQuestion, "id">[];
}

export const quizzesApi = {
  async getQuiz(documentId: string): Promise<StrapiSingleResponse<Quiz>> {
    return apiClient.get<StrapiSingleResponse<Quiz>>(`/api/quizzes/${documentId}?populate=*`);
  },

  async getQuizzesByCourse(courseDocId: string): Promise<StrapiListResponse<Quiz>> {
    const query = new URLSearchParams({
      "filters[course][documentId][$eq]": courseDocId,
      populate: "*",
    });

    return apiClient.get<StrapiListResponse<Quiz>>(`/api/quizzes?${query.toString()}`);
  },

  async createQuiz(data: CreateQuizInput): Promise<StrapiSingleResponse<Quiz>> {
    return apiClient.post<StrapiSingleResponse<Quiz>>("/api/quizzes", {
      data,
    });
  },

  async updateQuiz(documentId: string, data: UpdateQuizInput): Promise<StrapiSingleResponse<Quiz>> {
    return apiClient.put<StrapiSingleResponse<Quiz>>(`/api/quizzes/${documentId}`, {
      data,
    });
  },

  async deleteQuiz(documentId: string): Promise<{ data: Quiz }> {
    return apiClient.delete<{ data: Quiz }>(`/api/quizzes/${documentId}`);
  },

  async submitQuiz(payload: QuizSubmissionPayload): Promise<QuizSubmissionResponse> {
    return apiClient.post<QuizSubmissionResponse>("/api/quiz-results/submit", {
      data: payload,
    });
  },

  async getMyQuizResults(page = 1, pageSize = 25): Promise<StrapiListResponse<QuizResultRecord>> {
    const query = new URLSearchParams({
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
      populate: "*",
      sort: "submittedAt:desc",
    });

    return apiClient.get<StrapiListResponse<QuizResultRecord>>(`/api/quiz-results?${query.toString()}`);
  },

  async getCourseQuizResults(courseDocId?: string): Promise<StrapiListResponse<QuizResultRecord>> {
    const query = new URLSearchParams({
      "pagination[pageSize]": "100",
      populate: "*",
      sort: "submittedAt:desc",
    });

    if (courseDocId) {
      query.set("filters[quiz][course][documentId][$eq]", courseDocId);
    }

    return apiClient.get<StrapiListResponse<QuizResultRecord>>(`/api/quiz-results?${query.toString()}`);
  },

  async getQuizResult(documentId: string): Promise<StrapiSingleResponse<QuizResultRecord>> {
    return apiClient.get<StrapiSingleResponse<QuizResultRecord>>(`/api/quiz-results/${documentId}?populate=*`);
  },
};
