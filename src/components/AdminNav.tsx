import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  CogIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type ClassValue = string | undefined | null | string[];

function classNames(...classes: ClassValue[]) {
  return classes
    .reduce((acc: string[], cls: ClassValue) => {
      if (Array.isArray(cls)) {
        acc.push(...cls);
      } else if (typeof cls === "string") {
        acc.push(cls);
      }
      return acc;
    }, [])
    .filter((cls: string) => cls)
    .join(" ");
}

interface NavProps {
  currentPage: string;
}

type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
};

const updateNavigation = (page: string): NavigationItem[] => {
  return [
    {
      name: "Dashboard",
      href: "/",
      current: page === "admin" || page === "user",
    },
    {
      name: "Payments",
      href: "/admin/payments",
      current: page === "payments",
    },
    {
      name: "Members",
      href: "/admin/members",
      current: page === "members",
    },
    {
      name: "Calendar",
      href: "/admin/calendar",
      current: page === "calendar",
    },
  ];
};

export default function TailwindNav({ currentPage }: NavProps) {
  const navigation: NavigationItem[] = updateNavigation(currentPage);
  const { data: sessionData } = useSession();

  return (
    <Disclosure as="nav" className="bg-slate-50 dark:bg-slate-600">
      {({ open }) => (
        <>
          <div className="mx-auto border-b border-slate-200 px-2 dark:border-slate-500 sm:px-6 lg:px-8">
            <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <h1 className="text-3xl font-bold">HoneyDew</h1>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200"
                            : "text-slate-800 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-300",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link
                  href={"/settings"}
                  type="button"
                  className="rounded-full bg-slate-200 p-1 text-slate-800 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:bg-slate-700 dark:text-slate-200"
                >
                  <span className="sr-only">View notifications</span>
                  <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="rounded-full bg-slate-200 p-1 text-slate-800 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:bg-slate-700 dark:text-slate-200">
                      <span className="sr-only">Open user menu</span>
                      <UserIcon className="h-6 w-6 rounded-full" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              " w-full px-4 py-2 text-start text-sm text-gray-700"
                            )}
                            onClick={
                              sessionData
                                ? () =>
                                    void signOut({
                                      callbackUrl: process.env.NEXT_PUBLIC_URL,
                                    })
                                : () => console.log("Error")
                            }
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-200"
                      : "text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-200",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
