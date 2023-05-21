/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const paymentRequestRouter = createTRPCRouter({
  createPaymentRequest: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        organization_id: z.string(),
        amount: z.number(),
        due_by: z.nullable(z.date()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userToRequest = await ctx.prisma.user.findUnique({
          where: {
            id: input.user_id,
          },
        });
        if (userToRequest && userToRequest.organizationId && input.due_by)
          return await ctx.prisma.paymentRequest
            .create({
              data: {
                userId: input.user_id,
                amount: input.amount,
                dueBy: input.due_by,
                amountPending: input.amount,
                organizationId: userToRequest.organizationId,
              },
            })
            .catch((e: any) => {
              console.error("Failed to create payment request");
            });
      } catch (error) {
        console.log("error", error);
      }
    }),
  fulfillPaymentRequest: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        organization_id: z.number(),
        amount: z.number(),
        due_by: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userToRequest = await ctx.prisma.user.findUnique({
          where: {
            id: input.user_id,
          },
        });
        if (userToRequest && userToRequest.organizationId)
          await ctx.prisma.paymentRequest
            .create({
              data: {
                userId: input.user_id,
                amount: input.amount,
                dueBy: input.due_by,
                amountPending: input.amount,
                organizationId: userToRequest.organizationId,
              },
            })
            .catch((e: any) => {
              console.error("Failed to fulfill request");
            });
      } catch (error) {
        console.log("error", error);
      }
    }),
  getAllOrgPaymentRequests: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx;

      if (session && !session.user?.id) {
        throw new Error("Not authenticated");
      }

      if (session)
        return ctx.prisma.organization.findUnique({
          where: {
            id: input,
          },
          select: {
            paymentRequest: true,
          },
        });
    }),
});
