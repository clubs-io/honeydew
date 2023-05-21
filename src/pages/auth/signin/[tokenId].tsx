import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignInWithInvite({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { tokenId } = router.query;
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 p-36 dark:bg-gray-900">
      <div className="w-fit rounded-md bg-white p-8 shadow dark:bg-gray-800">
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white">
          Welcome to honeydew
        </h2>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Click here to setup your account
        </p>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="mb-2 mr-2 mt-8 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/restrict-plus-operands
              onClick={() =>
                signIn(provider.id, {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  callbackUrl: `${process.env.NEXT_PUBLIC_URL}/accept_invite/${tokenId}`,
                })
              }
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
