import { Organization, User } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
export const organizationRouter = createTRPCRouter({
    createOrganization: protectedProcedure
      .input(
          z.object({
            user_id: z.string(),
            organization_name: z.string(),
          }),
      ).mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
            data: {
                role: "OWNER"
            },
            where: {
                id: input.user_id
            }
        }).then(async () => {
            const current_org = ctx.prisma.organization.create({
                data: {
                    name: input.organization_name,
                },
            });
            await ctx.prisma.user.update({
                data: {
                    organizationId: (await current_org).id
                },
                where: {
                    id: input.user_id
                }
            })
        }).catch((e: any) => { console.error('Failed to create org'); });   
      } catch (error) {
        console.log("error", error);
      }
    }),
    getOrganizationUsers: protectedProcedure
      .input(
          z.object({
            user_id: z.string(),
            organization_id: z.nullable(z.number()),
          }),
      ).query(async ({ ctx, input }) => {
      try {
        const currentUser = await ctx.prisma.user.findFirst({
            select: {
                role: true,
                organizationId: true,
            },
            where: {
                id: input.user_id
            }
        })
        if (currentUser && currentUser.organizationId && (currentUser.role === "OWNER" || currentUser.role === "ADMIN") && input.organization_id === currentUser.organizationId){
          return await ctx.prisma.user.findMany({
              select: {
                name: true,
                id: true,
                role: true,
                email: true,
              },
              where: {
                  organizationId: input.organization_id,
              },
          });
        }
        else {
          return []
        }
      } catch (error) {
        console.log("error", error);
      }
    }),
    getOrganizationInvitations: protectedProcedure
      .input(
          z.object({
            user_id: z.string(),
            organization_id: z.nullable(z.number()),
          }),
      ).query(async ({ ctx, input }) => {
      try {
        const currentUser = await ctx.prisma.user.findFirst({
            select: {
                role: true,
                organizationId: true,
            },
            where: {
                id: input.user_id
            }
        })
        if (currentUser && currentUser.organizationId && (currentUser.role === "OWNER" || currentUser.role === "ADMIN") && input.organization_id === currentUser.organizationId){
          return await ctx.prisma.invitation.findMany({
              select: {
                id: true,
                email: true,
                createdAt: true,
                status: true,
              },
              where: {
                  organizationId: input.organization_id,
              },
          });
        }
        else {
          return []
        }
      } catch (error) {
        console.log("error", error);
      }
    }),
  });