
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'true_false', 'text']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Quizzes table
export const quizzesTable = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  created_by: integer('created_by').notNull().references(() => usersTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Questions table
export const questionsTable = pgTable('questions', {
  id: serial('id').primaryKey(),
  quiz_id: integer('quiz_id').notNull().references(() => quizzesTable.id),
  question_text: text('question_text').notNull(),
  question_type: questionTypeEnum('question_type').notNull(),
  order_index: integer('order_index').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Answer options table
export const answerOptionsTable = pgTable('answer_options', {
  id: serial('id').primaryKey(),
  question_id: integer('question_id').notNull().references(() => questionsTable.id),
  option_text: text('option_text').notNull(),
  is_correct: boolean('is_correct').notNull(),
  order_index: integer('order_index').notNull()
});

// Quiz attempts table
export const quizAttemptsTable = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  quiz_id: integer('quiz_id').notNull().references(() => quizzesTable.id),
  score: numeric('score', { precision: 5, scale: 2 }).notNull(),
  total_questions: integer('total_questions').notNull(),
  completed_at: timestamp('completed_at'),
  started_at: timestamp('started_at').defaultNow().notNull()
});

// User answers table
export const userAnswersTable = pgTable('user_answers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  question_id: integer('question_id').notNull().references(() => questionsTable.id),
  answer_text: text('answer_text'),
  selected_option_id: integer('selected_option_id').references(() => answerOptionsTable.id),
  is_correct: boolean('is_correct').notNull(),
  answered_at: timestamp('answered_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  quizzes: many(quizzesTable),
  quizAttempts: many(quizAttemptsTable),
  userAnswers: many(userAnswersTable)
}));

export const quizzesRelations = relations(quizzesTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [quizzesTable.created_by],
    references: [usersTable.id]
  }),
  questions: many(questionsTable),
  quizAttempts: many(quizAttemptsTable)
}));

export const questionsRelations = relations(questionsTable, ({ one, many }) => ({
  quiz: one(quizzesTable, {
    fields: [questionsTable.quiz_id],
    references: [quizzesTable.id]
  }),
  answerOptions: many(answerOptionsTable),
  userAnswers: many(userAnswersTable)
}));

export const answerOptionsRelations = relations(answerOptionsTable, ({ one, many }) => ({
  question: one(questionsTable, {
    fields: [answerOptionsTable.question_id],
    references: [questionsTable.id]
  }),
  userAnswers: many(userAnswersTable)
}));

export const quizAttemptsRelations = relations(quizAttemptsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [quizAttemptsTable.user_id],
    references: [usersTable.id]
  }),
  quiz: one(quizzesTable, {
    fields: [quizAttemptsTable.quiz_id],
    references: [quizzesTable.id]
  })
}));

export const userAnswersRelations = relations(userAnswersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userAnswersTable.user_id],
    references: [usersTable.id]
  }),
  question: one(questionsTable, {
    fields: [userAnswersTable.question_id],
    references: [questionsTable.id]
  }),
  selectedOption: one(answerOptionsTable, {
    fields: [userAnswersTable.selected_option_id],
    references: [answerOptionsTable.id]
  })
}));

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  quizzes: quizzesTable,
  questions: questionsTable,
  answerOptions: answerOptionsTable,
  quizAttempts: quizAttemptsTable,
  userAnswers: userAnswersTable
};
