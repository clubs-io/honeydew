/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "../../../env.mjs";
import { createStripeAccountForOrg, getOrCreateStripeAccountForOrg, getOrCreateStripeCustomerIdForUser, getStripeAccountForOrg } from "../../../server/stripe/stripe-webhook-handlers";
import { createTRPCRouter, protectedProcedure } from "../../../server/api/trpc";
import { z } from "zod";

export const stripeRouter = createTRPCRouter({

  createAccount: protectedProcedure.mutation(async({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { stripe, session, prisma, req } = ctx;

    console.log(session.user?.id)

    const connectURL = await createStripeAccountForOrg({
      prisma,
      stripe,
      userId: session.user?.id,
    });

    if (!connectURL) {
      throw new Error("Could not create or get organization ID");
    }

    return connectURL;

  }),

  createCheckoutSession: protectedProcedure.input(
    z.object({
      priceAmount: z.number(),
      description: z.string(),
      paymentRequestId: z.string(),
    }),
    ).mutation(async ({ ctx, input }) => {
    
    console.log(input.priceAmount);
    const { stripe, session, prisma, req } = ctx;

    const orgId = await getStripeAccountForOrg({
      prisma,
      stripe,
      userId: session.user?.id,
    });

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: session.user?.id,
      orgStripeId: orgId!,
    });

    const product = await stripe.products.create({
      name: "Honeydew Product",
      description: input.description,
    },
    {
      stripeAccount: orgId,
    })

    const price = await stripe.prices.create({
      currency: "usd",
      product: product.id,
      unit_amount: Number(input.priceAmount)*100,
      metadata: {
        id: input.paymentRequestId
      }
    },
    {
      stripeAccount: orgId,
    })

    const baseUrl =
      env.NODE_ENV === "development"
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        ? `http://${req.headers.host ?? "localhost:3000"}`
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: session.user?.id,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/user`,
      cancel_url: `${baseUrl}/user`,
      metadata: {
        id: input.paymentRequestId
      },
    },
    {
      stripeAccount: orgId,
    });

    if (!checkoutSession) {
      throw new Error("Could not create checkout session");
    }

    return { checkoutUrl: checkoutSession.url };
  }),
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { stripe, session, prisma, req } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: session.user?.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        ? `http://${req.headers.host ?? "localhost:3000"}`
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),
});