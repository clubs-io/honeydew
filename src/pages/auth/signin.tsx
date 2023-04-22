import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="h-screen w-screen flex flex-col sm:flex-row">
      {/* Container */}
      <div className=" bg-white w-full sm:w-2/5 h-screen flex flex-col items-center justify-center
        p-8">
        <div className="flex flex-col gap-y-10">
          <div>
            <h2 className="text-4xl text-slate-800 font-bold">Log in</h2>
            <p className="mt-2 text-lg text-slate-600">Welcome back! Please enter your details</p>
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button className="border border-1 border-gray-300 px-8 py-3 rounded-md mt-4 hover:bg-gray-200"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => signIn(provider.id)}>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account yet?
              <Link className="text-blue-500 hover:underline dark:text-primary-500 font-semibold" href="#"> Sign-up here</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-slate-200 sm:w-3/5">
        <div className="mx-auto max-w-xl mt-52 flex flex-col gap-8">
          <h1 className="text-4xl text-slate-600">
            Few things make me feel more powerful than using Honeydew to make my life easier and more efficient.
          </h1>
          <div className="flex flex-row items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-xl text-slate-600">
                — Rayan Shrestha
              </h2>
              <p className="text-xl text-slate-400">
                Treasurer, Beta Chi Theta 
              </p>
            </div>
            <div className="flex flex-row">
              <StarIcon className="w-5 " />
              <StarIcon className="w-5 " />
              <StarIcon className="w-5 " />
              <StarIcon className="w-5 " />
              <StarIcon className="w-5 " />
            </div>
          </div>
        </div>
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
