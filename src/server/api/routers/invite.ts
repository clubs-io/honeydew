import * as Postmark from "postmark";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const client = process.env.POSTMARK_CLIENT
  ? new Postmark.ServerClient(process.env.POSTMARK_CLIENT)
  : null;
export const inviteRouter = createTRPCRouter({
  acceptInvite: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const invitation = await ctx.prisma.invitation.findUnique({
          where: {
            token: input.tokenId,
          },
        });
        if (invitation && invitation.status === "PENDING") {
          await ctx.prisma.user.update({
            data: {
              organizationId: invitation.organizationId,
            },
            where: {
              id: ctx.session.user.id,
            },
          });
          await ctx.prisma.invitation.update({
            data: {
              status: "ACCEPTED",
            },
            where: {
              token: input.tokenId,
            },
          });
        }
      } catch (error) {
        console.log("Failed to accept invite", error);
      }
    }),
  createInvite: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        orgId: z.string(),
        orgName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const generated_token = String(uuidv4());
        if (client) {
          const invite = await ctx.prisma.invitation.create({
            data: {
              email: input.email,
              organizationId: input.orgId,
              token: generated_token,
            },
          });
          const orgName = await ctx.prisma.organization.findUnique({
            where: {
              id: input.orgId,
            },
          });
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions
          const clientUrl = `${process.env.NEXT_PUBLIC_URL}/auth/signin/${invite.token}`;
          await client.sendEmailWithTemplate(
            {
              From: "akshay@afterquote.com",
              To: input.email,
              TemplateAlias: "user-invitation",
              TemplateModel: {
                product_url: "product_url_Value",
                product_name: "HoneyDew",
                invite_sender_name: orgName ? orgName.name : "HoneyDew",
                invite_sender_organization_name: orgName
                  ? orgName.name
                  : "HoneyDew",
                action_url: clientUrl,
                support_email: "akshay@afterquote.com",
                live_chat_url: "live_chat_url_Value",
                help_url: "HoneyDew.com",
                company_name: "HoneyDew",
                company_address: "Philadelphia, PA",
              },
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
            },
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (error, result) => {
              if (error) {
                console.error(error);
              } else if (result) {
                console.log(result);
                try {
                  await ctx.prisma.invitationEmailSends.create({
                    data: {
                      email: input.email,
                      emailService: "Postmark",
                      invitationId: invite.id,
                    },
                  });
                } catch (error) {
                  console.log(error);
                }
              }
            }
          );
        }
      } catch (error) {
        console.log("error", error);
      }
    }),
});
