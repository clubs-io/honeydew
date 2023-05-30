import Image from "next/image";

export function Testimonial() {
  return (
    <section className="bg-indigo-50 ">
      <div className="mx-auto max-w-screen-sm px-4 py-8 text-center">
        <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Don&apos;t take our word for it
        </h2>
      </div>
      <div className="mx-auto flex max-w-screen-xl flex-col justify-between px-4 pb-8 sm:flex-row lg:px-6 lg:pb-24">
        <div className="flex flex-col px-10 sm:w-1/3">
          <div className="flex flex-col ">
            <blockquote>
              <p className="text-xl text-gray-900 md:text-2xl">
                Honeydew transformed our financial operations, empowering our
                fraternity to prioritize community building and meaningful
                connections.,{" "}
              </p>
            </blockquote>
            <div className="mt-4 ">
              <div className="font-medium text-gray-900 dark:text-white">
                - Abhay Jhala
              </div>
              <div className="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">
                Member at Delta Sigma Pi
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col px-10 sm:w-1/3">
          <div className="flex flex-col items-center  ">
            <blockquote>
              <p className="text-xl text-gray-900 md:text-2xl">
                HoneyDew is an absolute game-changer! It simplifies our
                finances, streamlines budgeting, and empowers us to make
                informed decisions. I&apos;m beyond excited about its impact on
                our organization&apos;s success!&quot;
              </p>
            </blockquote>
          </div>
          <div className="mt-4 ">
            <div className="font-medium text-gray-900 dark:text-white">
              VP of Finances, Beta Chi Theta
            </div>
          </div>
        </div>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col px-10 sm:w-1/3">
          <div className="flex flex-col items-center  ">
            <blockquote>
              <p className="text-xl text-gray-900 md:text-2xl">
                I cannot overstate the impact Honeydew has had on streamlining
                our financial management.
              </p>
            </blockquote>
          </div>
          <div className="mt-4 flex">
            <div className="mt-4 ">
              <div className="font-medium text-gray-900 dark:text-white">
                Co-founder Nepali Student Association
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
