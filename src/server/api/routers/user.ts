import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getUserOrganization: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findFirst({
          select: {
            organizationId: true,
          },
          where: {
            id: input,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  });

