import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignInWithInvite({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { tokenId } = router.query;
  return (
    <div className="bg-slate-50 dark:bg-gray-900 h-screen w-screen flex p-36 items-center justify-center">
      <div className="dark:bg-gray-800 bg-white shadow w-fit p-8 rounded-md">
        <h2 className="text-4xl text-slate-800 font-extrabold dark:text-white">Welcome back</h2>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button className="mt-8 w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/restrict-plus-operands
              onClick={() => signIn(provider.id, {callbackUrl: process.env.NEXT_PUBLIC_URL + "/accept_invite/" + tokenId})}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Don&apos;t have an account yet?
          <Link className="text-blue-500 hover:underline dark:text-primary-500" href="#"> Sign-up here</Link>
        </p>
      </div>
    </div>
  )
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
  }
}