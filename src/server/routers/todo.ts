import { z } from 'zod';

import { publicProcedure, router } from './../trpc';
import { getXataClient } from './../xata';
const db = getXataClient().db;

export const todoRouter = router({
  getTodos: publicProcedure.query(async () => {
    const res = await db.todo.getAll();
    return res.map((todo) => ({
      id: todo.id,
      content: todo.content,
      done: todo.done,
      description: todo.description,
      xata: {
        id: todo.id,
        createdAt: todo.xata.createdAt.toISOString(),
        updatedAt: todo.xata.updatedAt.toISOString(),
        version: todo.xata.version,
      },
    }));
  }),
  addTodo: publicProcedure
    .input(
      z.object({
        content: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const res = await db.todo.create({
        content: opts.input.content,
        description: opts.input.description,
        done: false,
      });
      return res;
    }),
  setDone: publicProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      await db.todo
        .updateOrThrow({
          id: opts.input.id,
          done: opts.input.done,
        })
        .catch((err) => {
          if (err.code === 'not_found') {
            throw new Error('Todo not found');
          }
          throw err;
        });

      return true;
    }),
});

export type TodoRouter = typeof todoRouter;
