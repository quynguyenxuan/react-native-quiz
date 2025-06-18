
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  registerInputSchema, 
  loginInputSchema, 
  createQuizInputSchema, 
  createQuestionInputSchema, 
  startQuizInputSchema, 
  submitAnswerInputSchema, 
  completeQuizInputSchema 
} from './schema';

// Import handlers
import { register } from './handlers/register';
import { login } from './handlers/login';
import { getUserProfile } from './handlers/get_user_profile';
import { getQuizzes } from './handlers/get_quizzes';
import { getQuizById } from './handlers/get_quiz_by_id';
import { createQuiz } from './handlers/create_quiz';
import { createQuestion } from './handlers/create_question';
import { startQuiz } from './handlers/start_quiz';
import { submitAnswer } from './handlers/submit_answer';
import { completeQuiz } from './handlers/complete_quiz';
import { getUserQuizAttempts } from './handlers/get_user_quiz_attempts';
import { getQuizLeaderboard } from './handlers/get_quiz_leaderboard';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  register: publicProcedure
    .input(registerInputSchema)
    .mutation(({ input }) => register(input)),

  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),

  getUserProfile: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getUserProfile(input.userId)),

  // Quiz routes
  getQuizzes: publicProcedure
    .query(() => getQuizzes()),

  getQuizById: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .query(({ input }) => getQuizById(input.quizId)),

  createQuiz: publicProcedure
    .input(createQuizInputSchema)
    .mutation(({ input }) => createQuiz(input)),

  createQuestion: publicProcedure
    .input(createQuestionInputSchema)
    .mutation(({ input }) => createQuestion(input)),

  // Quiz attempt routes
  startQuiz: publicProcedure
    .input(startQuizInputSchema)
    .mutation(({ input }) => startQuiz(input)),

  submitAnswer: publicProcedure
    .input(submitAnswerInputSchema)
    .mutation(({ input }) => submitAnswer(input)),

  completeQuiz: publicProcedure
    .input(completeQuizInputSchema)
    .mutation(({ input }) => completeQuiz(input)),

  getUserQuizAttempts: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getUserQuizAttempts(input.userId)),

  getQuizLeaderboard: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .query(({ input }) => getQuizLeaderboard(input.quizId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
