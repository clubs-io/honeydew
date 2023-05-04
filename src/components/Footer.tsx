import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const Items = [
    {
      title: "About",
      link: "#"
    },
    {
      title: "Discord Server",
      link: "#"
    },
    {
      title: "Contact Us",
      link: "#"
    },
    {
      title: "Terms",
      link: "#"
    },
  ]
  return (
    <div className="bg-white dark:bg-gray-800">
        <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                <div>
                    <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h3>
                    <ul className="text-gray-500 dark:text-gray-400">
                      {Items.map((item, index) => (
                        <li className="mb-4" key={index}>{item.title}</li>
                      ))}
                    </ul>
                </div>
            </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="text-center">
            <Link href="#" className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900 dark:text-white">
                {/* <Image src="./images/logo.svg" fill class="h-6 mr-3 sm:h-9" alt="Landwind Logo" /> */}
                Honeydew    
            </Link>
            <span className="block text-sm text-center text-gray-500 dark:text-gray-400">© 2021-2022 Honeydew. All Rights Reserved. Built with 
            <Link href="https://github.com/themesberg/landwind" className="text-purple-600 hover:underline dark:text-purple-500"> Landwind </Link>
            </span>
          </div>
        </div>
    </div>
  );
};
export default Footer;
