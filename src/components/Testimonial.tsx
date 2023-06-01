import { StarIcon } from "@heroicons/react/24/solid";

export function Testimonial() {
  return (
    <section className="-purple-200 bg-gradient-to-b from-white via-fuchsia-100 to-white">
      <div className="mx-auto max-w-screen-sm px-4 py-8 text-center">
        <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-600 dark:text-white">
          Don&apos;t take our word for it
        </h2>
      </div>
      <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-4 px-4 pb-8 sm:flex-row lg:px-6 lg:pb-24">
        <div
          className="flex h-full w-full flex-col
          rounded-md border border-gray-100 bg-gray-300 bg-opacity-30 bg-clip-padding px-10 py-4 backdrop-blur-sm backdrop-filter sm:w-1/3"
        >
          <div className="flex flex-col ">
            <blockquote>
              <p className="text-xl text-gray-800 md:text-2xl">
                Honeydew transformed our financial operations.
              </p>
            </blockquote>
            <div className="mt-2 flex">
              <StarIcon className="h-6 w-6 fill-yellow-500" />
              <StarIcon className="h-6 w-6 fill-yellow-500" />
              <StarIcon className="h-6 w-6 fill-yellow-500" />
              <StarIcon className="h-6 w-6 fill-yellow-500" />
              <StarIcon className="h-6 w-6 fill-yellow-500" />
            </div>
            <div className="mt-4 ">
              <div className="font-medium text-gray-800 dark:text-white">
                - Abhay Jhala
              </div>
              <div className="pl-3 text-sm font-light text-gray-800 dark:text-gray-400">
                Member at Delta Sigma Pi
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <div
          className="flex h-full w-full flex-col
          rounded-md border border-gray-100 bg-gray-300 bg-opacity-30 bg-clip-padding px-10 py-4 backdrop-blur-sm backdrop-filter sm:w-1/3"
        >
          <div className="flex flex-col items-center  ">
            <blockquote>
              <p className="text-xl text-gray-800 md:text-2xl">
                HoneyDew is a game-changer!
              </p>
            </blockquote>
          </div>
          <div className="mt-2 flex">
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
          </div>
          <div className="mt-4 ">
            <div className="font-medium text-gray-800 dark:text-white">
              VP of Finances, Beta Chi Theta
            </div>
          </div>
        </div>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <div
          className="flex h-full w-full flex-col
          rounded-md border border-gray-100 bg-gray-300 bg-opacity-30 bg-clip-padding px-10 py-4 backdrop-blur-sm backdrop-filter sm:w-1/3"
        >
          <div className="flex flex-col items-center  ">
            <blockquote>
              <p className="text-xl text-gray-800 md:text-2xl">
                Honeydew has streamlined our financial management.
              </p>
            </blockquote>
          </div>
          <div className="mt-2 flex">
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
            <StarIcon className="h-6 w-6 fill-yellow-500" />
          </div>
          <div className="mt-4 ">
            <div className="font-medium text-gray-800 dark:text-white">
              Co-founder Nepali Student Association
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
