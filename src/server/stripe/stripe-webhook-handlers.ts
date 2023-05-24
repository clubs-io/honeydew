/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "@prisma/client";
import { env } from "process";
import type Stripe from "stripe";

export const getOrCreateStripeAccountForOrg = async ({
  stripe,
  prisma,
  userId,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  let org;
  if (user?.organizationId !== null) {
    org = await prisma.organization.findUnique({
      where: {
        id: user?.organizationId,
      },
    });
  }
  // const org = await prisma.organization.findUnique({
  //   where: {
  //     id: user?.organizationId,
  //   },
  // });

  if (org?.stripeOrganizationId)
    throw new Error("Already has a stripe account");

  // create a new customer
  const account = await stripe.accounts.create({
    type: "standard",
    // use metadata to link this Stripe customer to internal user id
    // metadata: {
    //   userId,
    // },
  });

  let updatedOrg;
  if (user !== null && user.organizationId !== null) {
    updatedOrg = await prisma.organization.update({
      where: {
        id: user.organizationId,
      },
      data: {
        stripeOrganizationId: account.id,
      },
    });
  }

  console.log(account.id);
  
  const accountLink = await stripe.accountLinks.create({
    account: '{{CONNECTED_ACCOUNT_ID}}',
    refresh_url: `localhost:3000/admin/settings`,
    return_url: 'localhost:3000/admin/settings',
    type: 'account_onboarding',
  });
  const link = accountLink.url;

  return account;

  // if (updatedOrg.id) {
  //   return updatedOrg.id;
  // }
};

export const createStripeAccountForOrg = async ({
  stripe,
  prisma,
  userId,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const account = await stripe.accounts.create({
    type: "standard",
    // use metadata to link this Stripe customer to internal user id
    // metadata: {
    //   userId,
    // },
  });

  console.log("Account id: ", account.id);

  let org;
  if (user?.organizationId !== null) {
    org = await prisma.organization.findUnique({
      where: {
        id: user?.organizationId,
      },
    });
  }

  let updatedOrg;
  if (user !== null && user.organizationId !== null) {
    updatedOrg = await prisma.organization.update({
      where: {
        id: user.organizationId,
      },
      data: {
        stripeOrganizationId: account.id,
      },
    });
  }
  
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `http://localhost:3000/settings`,
    return_url: 'http://localhost:3000/settings',
    type: 'account_onboarding',
  });
  const link = accountLink.url;
  console.log("Account Link: ", link);
  return link;
};

export const getStripeAccountForOrg = async ({
  stripe,
  prisma,
  userId,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  let org;
  if (user?.organizationId !== null) {
    org = await prisma.organization.findUnique({
      where: {
        id: user?.organizationId,
      },
    });
  }

  if (org?.stripeOrganizationId)
    return org?.stripeOrganizationId;
};

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
  stripe,
  prisma,
  userId,
  orgStripeId,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
  orgStripeId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found");

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // create a new customer
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    // use metadata to link this Stripe customer to internal user id
    metadata: {
      userId,
    },
  },
  {
    stripeAccount: orgStripeId,
  });

  // update with new customer id
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  if (updatedUser.stripeCustomerId) {
    return updatedUser.stripeCustomerId;
  }
};

export const handleInvoicePaid = async ({
  event,
  stripe,
  prisma,
}: {
  event: Stripe.Event;
  stripe: Stripe;
  prisma: PrismaClient;
}) => {
  const invoice = event.data.object as Stripe.Invoice;
  // const subscriptionId = invoice.subscription;
  const paymentid = invoice.metadata!.id;
  // const ident = obj.metadata.id;
  // console.log("ID ", ids);
  // console.log("payment if ", paymentid);
  // console.log("amount paid ", amount_payment);

  // const subscription = await stripe.subscriptions.retrieve(
  //   subscriptionId as string
  // );
  // const userId = subscription.metadata.userId;

  // update user with subscription data
  await prisma.paymentRequest.updateMany({
    where: {
      id: paymentid
    },
    data: {
      status: "COMPLETED",
    }
  })
};

export const handleSubscriptionCreatedOrUpdated = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  // update user with subscription data
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: subscription.status,
    },
  });
};

export const handleCreateProduct = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  // remove subscription data from user
  // create temporary product
  // or update product id
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeSubscriptionId: null,
      stripeSubscriptionStatus: null,
    },
  });
};

export const handleSubscriptionCanceled = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  // remove subscription data from user
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeSubscriptionId: null,
      stripeSubscriptionStatus: null,
    },
  });
};
