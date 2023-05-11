import { env } from "../../../env.mjs";
import { getOrCreateStripeAccountForOrg, getOrCreateStripeCustomerIdForUser } from "../../../server/stripe/stripe-webhook-handlers";
import { createTRPCRouter, protectedProcedure } from "../../../server/api/trpc";

export const stripeRouter = createTRPCRouter({

  createAccount: protectedProcedure.mutation(async({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { stripe, session, prisma, req } = ctx;

    console.log(session.user?.id)

    const orgId = await getOrCreateStripeAccountForOrg({
      prisma,
      stripe,
      userId: session.user?.id,
    });

    if (!orgId) {
      throw new Error("Could not create or get organization ID");
    }

    return orgId;

  }),
  // createPayment: protectedProcedure.mutation(async({ ctx }) => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   const { stripe, session, prisma, req } = ctx;

  //   console.log(session.user?.id)

  //   const orgId = await getOrCreateStripeAccountForOrg({
  //     prisma,
  //     stripe,
  //     userId: session.user?.id,
  //   });

  //   if (!orgId) {
  //     throw new Error("Could not create or get organization ID");
  //   }

  //   return orgId;

  // }),
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
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

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: session.user?.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/dashboard?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId: session.user?.id,
        },
      },
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