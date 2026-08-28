export interface CourseOwner {
  id: number;
  documentId: string;
  username: string;
  email: string;
}

export interface Lesson {
  id: number;
  documentId: string;
  title: string;
  content?: string;
  videoUrl?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  course?: {
    id: number;
    documentId: string;
    title: string;
  };
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex?: number;
}

export interface Quiz {
  id: number;
  documentId: string;
  title: string;
  questions: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  course?: {
    id: number;
    documentId: string;
    title: string;
  };
}

export interface Course {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  owner?: CourseOwner | null;
  lessons?: Lesson[];
  quizzes?: Quiz[];
}

export interface Enrollment {
  id: number;
  documentId: string;
  enrolledAt: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  course?: Course | null;
  student?: CourseOwner | null;
  isCompleted?: boolean;
  completedLessons?: number;
  totalLessons?: number;
  completedQuizzes?: number;
  totalQuizzes?: number;
  progressPercentage?: number;
}

export interface LessonProgress {
  id: number;
  documentId: string;
  completed: boolean;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  lesson?: Lesson | null;
  student?: CourseOwner | null;
}

export interface QuizAnswerSubmission {
  questionIndex: number;
  selectedOptionIndex: number;
  questionId?: number;
}

export interface QuizAnswerResult {
  questionIndex: number;
  questionText: string;
  options: string[];
  selectedOptionIndex: number | null;
  correctAnswerIndex: number;
  isCorrect: boolean;
}

export interface QuizSubmissionPayload {
  quizId: string;
  answers: QuizAnswerSubmission[];
}

export interface QuizSubmissionResponse {
  message: string;
  documentId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: QuizAnswerResult[];
  submittedAt: string;
}

export interface QuizResultRecord {
  id: number;
  documentId: string;
  score: number;
  totalQuestions: number;
  answers: QuizAnswerResult[];
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  quiz?: Quiz | null;
  student?: CourseOwner | null;
}

export interface CourseProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  completedLessonIds: (string | number)[];
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
}
