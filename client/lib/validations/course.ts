import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const lessonSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters")
    .trim(),
  content: z
    .string()
    .min(5, "Lesson content/notes must be at least 5 characters")
    .trim(),
  videoUrl: z
    .string()
    .url("Please enter a valid video stream URL")
    .or(z.literal(""))
    .optional(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

export const quizQuestionSchema = z.object({
  questionText: z
    .string()
    .min(3, "Question text is required")
    .trim(),
  options: z
    .array(z.string().min(1, "Option choice cannot be empty").trim())
    .min(2, "Each question must have at least 2 options")
    .max(5, "Maximum 5 options per question"),
  correctAnswerIndex: z
    .number()
    .min(0, "Please select the correct answer option"),
});

export type QuizQuestionFormValues = z.infer<typeof quizQuestionSchema>;

export const quizSchema = z.object({
  title: z
    .string()
    .min(3, "Quiz title must be at least 3 characters")
    .max(120, "Quiz title cannot exceed 120 characters")
    .trim(),
  questions: z
    .array(quizQuestionSchema)
    .min(1, "Quiz must contain at least 1 question"),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
