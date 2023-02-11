import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type {} from '@packages/db';
import { ObjectId } from "bson";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({ orderBy: { id: "desc" } });
  }),
  byId: publicProcedure.input(z.object({id: z.string()})).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: input.id } });
  }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.post.delete({ where: { id: input } });
  }),
  update: protectedProcedure.input(z.object({id: z.string(), content: z.string().optional(), title: z.string().optional()})).mutation(({ctx, input}) => {
    return ctx.prisma.post.update({
      where: {
        id: input.id,
      },
      data: {
        content: input.content,
        title: input.title,
      }
    })
  }),
  create: protectedProcedure.input(z.object({content: z.string(), title: z.string()})).mutation(({ctx, input}) => {
    return ctx.prisma.post.create({
      data: {
        id:new ObjectId().toHexString(),
        content: input.content,
        title: input.title,
      }
    })
  })
});