import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getUserOrganization: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findFirst({
          select: {
            organizationId: true,
            role: true,
          },
          where: {
            id: input,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
    subscriptionStatus: publicProcedure.query(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
  
      if (session && !session.user?.id) {
        throw new Error("Not authenticated");
      }
  
      if (session)
        return ctx.prisma.user.findUnique({
          where: {
            id: session.user?.id,
          },
          select: {
            stripeSubscriptionStatus: true,
          }
        });
      }),
  });

