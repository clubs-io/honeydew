import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function HeroBanner() {
  const { data: sessionData } = useSession();
  return (
    <div className="bg-white dark:bg-gray-900">
      {!(sessionData?.user !== undefined) && (
        <div className="mx-auto grid max-w-screen-xl px-4 pb-8 pt-20 lg:grid-cols-12 lg:gap-8 lg:py-16 lg:pt-28 xl:gap-0">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              Financial solutions for your college community
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              Our platform provides a comprehensive suite of tools to manage
              expenses, dues, and fundraising, all in one place. With our
              easy-to-use interface and powerful financial reporting
              capabilities, you can easily stay on top of your fraternity&apos;s
              financial health
            </p>
          </div>
          <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
            <Image
              src="/dancing.svg"
              alt="Honeydew"
              width={1064}
              height={832}
            />
          </div>
        </div>
      )}
    </div>
  );
}
