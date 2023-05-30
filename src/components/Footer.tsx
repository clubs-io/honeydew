import React from "react";
import Link from "next/link";

const Footer = () => {
  const Items = [
    {
      title: "About",
      link: "#",
    },
    {
      title: "Discord Server",
      link: "#",
    },
    {
      title: "Contact Us",
      link: "#",
    },
    {
      title: "Terms",
      link: "#",
    },
  ];
  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl p-4 py-6 md:p-8 lg:p-10 lg:py-16">
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <div className="text-center">
          <Link
            href="#"
            className="mb-5 flex items-center justify-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            {/* <Image src="./images/logo.svg" fill className="h-6 mr-3 sm:h-9" alt="Landwind Logo" /> */}
            Honeydew
          </Link>
          <span className="block text-center text-sm text-gray-500 dark:text-gray-400">
            © 2022-2023 Honeydew. All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  );
};
export default Footer;
