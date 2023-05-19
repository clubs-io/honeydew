import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner } from "flowbite-react";
import TailwindNav from "~/components/TailwindNav";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    void router.push("/");
  }
  if (status === "authenticated") {
    return (
      <>
        <div className="flex h-max w-screen flex-col dark:bg-slate-900">
          <TailwindNav currentPage={"admin"} />
          <main className="flex min-h-screen w-screen flex-row justify-center bg-slate-50 dark:bg-slate-700">
            <div className="container mx-16 mt-12 max-w-7xl gap-12">
              <div className="h-full w-full">
                {/* Header */}
                <div className="flex flex-col justify-between sm:flex-row">
                  {sessionData ? (
                    <div>
                      <h1 className="text-4xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                        Welcome back, {sessionData.user?.name}
                      </h1>
                      <p className="text-xl text-slate-500">
                        Track and manage your Organization&apos;s Payments
                      </p>
                    </div>
                  ) : (
                    <p>no session data</p>
                  )}
                  {/*<div className="">
                    <button type="button" className="flex py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                      Import
                    </button>
                  </div>
                  */}
                </div>
                {/* KPI Charts */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="relative w-full overflow-hidden rounded-xl bg-white p-4 text-gray-700 shadow-lg dark:bg-gray-800 dark:text-gray-100 sm:w-1/3">
                    <a href="#" className="block h-full w-full">
                      <div className="w-full">
                        <p className="mb-4 text-2xl font-light text-gray-700 dark:text-white">
                          Average payment time
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>April</p>
                          <p>3 days</p>
                        </div>
                        <div className="mb-4 h-2 w-full rounded-full bg-green-100">
                          <div className="h-full w-full rounded-full bg-green-500 text-center text-xs text-white"></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>March</p>
                          <p>6</p>
                        </div>
                        <div className="mb-4 h-2 w-full rounded-full bg-indigo-100">
                          <div className="h-full w-3/4 rounded-full bg-indigo-400 text-center text-xs text-white"></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>February</p>
                          <p>8</p>
                        </div>
                        <div className="mb-4 h-2 w-full rounded-full bg-blue-100">
                          <div className="h-full w-2/3 rounded-full bg-blue-400 text-center text-xs text-white"></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>January</p>
                          <p>16</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-pink-100">
                          <div className="h-full w-1/3 rounded-full bg-pink-400 text-center text-xs text-white"></div>
                        </div>
                      </div>
                    </a>
                  </div>
                  {/* Activity Card */}
                  <div className="relative w-full overflow-hidden rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800 sm:w-1/3">
                    <div className="mb-8 flex w-full items-center justify-between">
                      <p className="text-xl font-normal text-gray-800 dark:text-white">
                        Activity
                      </p>
                      <a
                        href="#"
                        className="flex items-center border-0 text-sm text-gray-300 hover:text-gray-600 focus:outline-none dark:text-gray-50 dark:hover:text-white"
                      >
                        VIEW ALL
                      </a>
                    </div>
                    <div className="mb-6 flex items-start justify-between rounded">
                      <span className="rounded-full bg-yellow-300 p-2 text-white dark:text-gray-800">
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 1792 1792"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-128-448v320h-1024v-192l192-192 128 128 384-384zm-832-192q-80 0-136-56t-56-136 56-136 136-56 136 56 56 136-56 136-136 56z"></path>
                        </svg>
                      </span>
                      <div className="flex w-full items-center justify-between">
                        <div className="ml-2 flex w-full flex-col items-start justify-between text-sm">
                          <p className="text-gray-700 dark:text-white">
                            <span className="mr-1 font-bold">Logan</span>
                            paid $200 for formal tickets
                          </p>
                          <p className="text-gray-300">Aug 10</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start justify-between rounded">
                      <span className="rounded-full bg-yellow-300 p-2 text-white dark:text-gray-800">
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 1792 1792"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-128-448v320h-1024v-192l192-192 128 128 384-384zm-832-192q-80 0-136-56t-56-136 56-136 136-56 136 56 56 136-56 136-136 56z"></path>
                        </svg>
                      </span>
                      <div className="flex w-full items-center justify-between">
                        <div className="ml-2 flex w-full flex-col items-start justify-between text-sm">
                          <p className="text-gray-700 dark:text-white">
                            <span className="mr-1 font-bold">Sid</span>
                            paid $125 for spring term dues
                          </p>
                          <p className="text-gray-300">Aug 1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Active Projects card */}
                  <div className="relative w-full rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800 sm:w-1/3">
                    <p className="w-max border-b border-gray-200 text-sm font-semibold text-gray-700 dark:text-white">
                      Payments received this month
                    </p>
                    <div className="my-6 flex items-end space-x-2">
                      <p className="text-5xl font-bold text-black dark:text-white">
                        30
                      </p>
                      <span className="flex items-center text-xl font-bold text-green-500">
                        <ArrowUpIcon className="h-5 w-5 text-green-500" />
                        33%
                      </span>
                      <p className="text-slate-500">vs last month</p>
                    </div>
                    <div className="dark:text-white">
                      <div className="flex items-center justify-between space-x-12 border-b border-gray-200 pb-2 text-sm md:space-x-24">
                        <p>Dues payments</p>
                        <div className="flex items-end text-xs">
                          25
                          <span className="flex items-center">
                            <ArrowUpIcon className="h-4 w-4 text-green-500" />
                            20%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between space-x-12 border-b border-gray-200 pb-2 text-sm md:space-x-24">
                        <p>Misc payments</p>
                        <div className="flex items-end text-xs">
                          5
                          <span className="flex items-center">
                            <ArrowUpIcon className="h-4 w-4 text-green-500" />
                            50%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between space-x-12 text-sm md:space-x-24">
                        <p>Food payments</p>
                        <div className="flex items-end text-xs">
                          2
                          <span className="flex items-center">
                            <ArrowUpIcon className="h-4 w-4 text-green-500" />
                            100%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table */}
                <div className="mb-8 mt-8">
                  <h1 className="mb-4 text-3xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                    Upcoming Dues
                  </h1>
                  <Table hoverable={true} className="">
                    <Table.Head>
                      <Table.HeadCell>Name</Table.HeadCell>
                      <Table.HeadCell>Amount</Table.HeadCell>
                      <Table.HeadCell>Due Date</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          Sid
                        </Table.Cell>
                        <Table.Cell>$200</Table.Cell>
                        <Table.Cell>Tomorrow</Table.Cell>
                        <Table.Cell className="flex flex-row gap-2">
                          <Badge className="w-fit" color="success">
                            Active
                          </Badge>
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }
  return (
    <div className="m-72 flex flex-col items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
};

export default Dashboard;
