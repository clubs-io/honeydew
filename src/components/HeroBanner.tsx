import React from "react";
import splash from "../assets/splash.svg";
import illustration from "../assets/3d-illustration.png";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function HeroBanner() {
  const { data: sessionData } = useSession();
  return (
    <div className="bg-white dark:bg-gray-900">
      {!(sessionData?.user !== undefined) && (
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Financial solutions for your college community
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Our platform provides a comprehensive suite of tools to manage expenses, dues, and fundraising, all in one place. With our easy-to-use interface and powerful financial reporting capabilities, you can easily stay on top of your fraternity&apos;s financial health
            </p>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <Image
              src="/hero.png"
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
