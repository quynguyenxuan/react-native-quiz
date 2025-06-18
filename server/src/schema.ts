
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Public user schema (without password)
export const publicUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type PublicUser = z.infer<typeof publicUserSchema>;

// Quiz schema
export const quizSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  created_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Quiz = z.infer<typeof quizSchema>;

// Question schema
export const questionSchema = z.object({
  id: z.number(),
  quiz_id: z.number(),
  question_text: z.string(),
  question_type: z.enum(['multiple_choice', 'true_false', 'text']),
  order_index: z.number().int(),
  created_at: z.coerce.date()
});

export type Question = z.infer<typeof questionSchema>;

// Answer option schema
export const answerOptionSchema = z.object({
  id: z.number(),
  question_id: z.number(),
  option_text: z.string(),
  is_correct: z.boolean(),
  order_index: z.number().int()
});

export type AnswerOption = z.infer<typeof answerOptionSchema>;

// User answer schema
export const userAnswerSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  question_id: z.number(),
  answer_text: z.string().nullable(),
  selected_option_id: z.number().nullable(),
  is_correct: z.boolean(),
  answered_at: z.coerce.date()
});

export type UserAnswer = z.infer<typeof userAnswerSchema>;

// Quiz attempt schema
export const quizAttemptSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  quiz_id: z.number(),
  score: z.number(),
  total_questions: z.number().int(),
  completed_at: z.coerce.date().nullable(),
  started_at: z.coerce.date()
});

export type QuizAttempt = z.infer<typeof quizAttemptSchema>;

// Input schemas
export const registerInputSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const createQuizInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().nullable(),
  created_by: z.number()
});

export type CreateQuizInput = z.infer<typeof createQuizInputSchema>;

export const createQuestionInputSchema = z.object({
  quiz_id: z.number(),
  question_text: z.string().min(1),
  question_type: z.enum(['multiple_choice', 'true_false', 'text']),
  order_index: z.number().int().nonnegative(),
  answer_options: z.array(z.object({
    option_text: z.string().min(1),
    is_correct: z.boolean(),
    order_index: z.number().int().nonnegative()
  })).optional()
});

export type CreateQuestionInput = z.infer<typeof createQuestionInputSchema>;

export const submitAnswerInputSchema = z.object({
  user_id: z.number(),
  question_id: z.number(),
  answer_text: z.string().nullable(),
  selected_option_id: z.number().nullable()
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerInputSchema>;

export const startQuizInputSchema = z.object({
  user_id: z.number(),
  quiz_id: z.number()
});

export type StartQuizInput = z.infer<typeof startQuizInputSchema>;

export const completeQuizInputSchema = z.object({
  attempt_id: z.number()
});

export type CompleteQuizInput = z.infer<typeof completeQuizInputSchema>;

// Response schemas
export const loginResponseSchema = z.object({
  user: publicUserSchema,
  token: z.string()
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const quizWithQuestionsSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  created_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  questions: z.array(z.object({
    id: z.number(),
    question_text: z.string(),
    question_type: z.enum(['multiple_choice', 'true_false', 'text']),
    order_index: z.number().int(),
    answer_options: z.array(answerOptionSchema)
  }))
});

export type QuizWithQuestions = z.infer<typeof quizWithQuestionsSchema>;
