import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "~/server/api/routers/user";
import { organizationRouter } from "./routers/organization";
import { inviteRouter } from "./routers/invite";
import { stripeRouter } from "./routers/stripe";
import { paymentRequestRouter } from "./routers/paymentRequest";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  organization: organizationRouter,
  invite: inviteRouter,
  stripe: stripeRouter,
  paymentRequest: paymentRequestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
