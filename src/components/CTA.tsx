import React from "react";
import Link from "next/link";

const CTA = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            Start for free today
          </h2>
          <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
            Try Honeydew for free. No credit card required.
          </p>
          <Link
            href="#"
            className="mb-2 mr-2 rounded-lg bg-purple-700 px-5 py-2.5 text-2xl text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
