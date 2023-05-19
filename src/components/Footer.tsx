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
        <div>
          <h3 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
            Company
          </h3>
          <ul className="flex flex-row gap-8 text-gray-500 dark:text-gray-400">
            {Items.map((item, index) => (
              <li className="mb-4" key={index}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <div className="text-center">
          <Link
            href="#"
            className="mb-5 flex items-center justify-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            {/* <Image src="./images/logo.svg" fill class="h-6 mr-3 sm:h-9" alt="Landwind Logo" /> */}
            Honeydew
          </Link>
          <span className="block text-center text-sm text-gray-500 dark:text-gray-400">
            © 2021-2022 Honeydew. All Rights Reserved. Built with
            <Link
              href="https://github.com/themesberg/landwind"
              className="text-purple-600 hover:underline dark:text-purple-500"
            >
              {" "}
              Landwind{" "}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Footer;
