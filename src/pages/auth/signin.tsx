import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { StarIcon } from "@heroicons/react/24/outline";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-screen w-screen flex-col sm:flex-row">
      <Head>
        <title>Sign in • Honeydew</title>
      </Head>
      {/* Container */}
      <div className=" flex h-screen w-full flex-col mt-36 items-center bg-white p-8 sm:w-1/2" >
        <div className="flex flex-col gap-y-20">
          <h1 className="inline-block bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300 via-cyan-800 to-purple-300 bg-clip-text text-7xl font-bold text-transparent">
            Honeydew
          </h1>
          <div>
            <h2 className="text-4xl font-bold text-slate-800">Log in</h2>
            <p className="mt-2 text-lg text-slate-600">
              Welcome back! Please enter your details
            </p>
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  className="border-1 mt-4 rounded-md border border-indigo-300 px-8 py-3 hover:bg-gray-200"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
            <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account yet?
              <Link
                className="dark:text-primary-500 font-semibold text-blue-500 hover:underline"
                href="#"
              >
                {" "}
                Sign-up here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="w-screen bg-gradient-to-tr from-indigo-700 to-indigo-300 sm:w-1/2">
        <div className="flex h-full w-full py-36 flex-col items-center justify-between">
          <div className="mx-auto flex max-w-xl flex-col gap-8">
            <h1 className="text-4xl text-white">
              Few things make me feel more powerful than setting up automations
              in RFP Tiger to make my life easier and more efficient.
            </h1>
              <div className="flex flex-row items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                — Ryan Sreshta
              </h2>
              <p className="text-xl text-slate-400">Beta Chi Theta</p>
              </div>
                <div className="flex flex-row">
                  <StarIcon className="w-6 fill-yellow-300" />
                  <StarIcon className="w-6 fill-yellow-300" />
                  <StarIcon className="w-6 fill-yellow-300" />
                  <StarIcon className="w-6 fill-yellow-300" />
                  <StarIcon className="w-6 fill-yellow-300" />
                </div>
              </div>
            </div>
          <Image
            className="z-10 rounded-lg border-slate-800"
            src={"/signin.svg"}
            width={400}
            height={400}
            alt={""}
          />

          </div>
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
