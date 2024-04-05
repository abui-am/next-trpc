import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { todoRouter } from './routers/todo';
export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  todo: todoRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
