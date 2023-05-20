import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner } from "flowbite-react";
import TailwindNav from "~/components/AdminNav";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  
  if (status === "unauthenticated"){
    void router.push("/")
  }
  if (status === "authenticated"){
    return (
      <>
        <div className="w-screen h-max flex flex-col dark:bg-slate-900">
          <TailwindNav currentPage={"user"} />
          <main className="w-screen flex justify-center min-h-screen flex-row bg-slate-50 dark:bg-slate-700">
            <div className="mt-12 mx-16 container gap-12 max-w-7xl">
              <div className="w-full h-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between">
                  {sessionData ?
                    <div>
                      <h1 className="text-4xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                        Welcome back, {sessionData.user?.name}
                      </h1>
                      <p className="text-xl text-slate-500">Track and manage your Organization&apos;s Payments</p>
                    </div>
                    : <p>no session data</p>
                  }
                  {/*<div className="">
                    <button type="button" className="flex py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                      <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                      Import
                    </button>
                  </div>
                  */}
                </div>
                {/* KPI Charts */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative p-4 overflow-hidden text-gray-700 bg-white shadow-lg rounded-xl w-full sm:w-1/3 dark:bg-gray-800 dark:text-gray-100">
                    <a href="#" className="block w-full h-full">
                      <div className="w-full">
                        <p className="mb-4 text-2xl font-light text-gray-700 dark:text-white">
                          Average payment time
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>
                            April
                          </p>
                          <p>
                            3 days
                          </p>
                        </div>
                        <div className="w-full h-2 mb-4 bg-green-100 rounded-full">
                          <div className="w-full h-full text-xs text-center text-white bg-green-500 rounded-full">
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>
                            March
                          </p>
                          <p>
                            6
                          </p>
                        </div>
                        <div className="w-full h-2 mb-4 bg-indigo-100 rounded-full">
                          <div className="w-3/4 h-full text-xs text-center text-white bg-indigo-400 rounded-full">
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>
                            February
                          </p>
                          <p>
                            8
                          </p>
                        </div>
                        <div className="w-full h-2 mb-4 bg-blue-100 rounded-full">
                          <div className="w-2/3 h-full text-xs text-center text-white bg-blue-400 rounded-full">
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <p>
                            January
                          </p>
                          <p>
                            16
                          </p>
                        </div>
                        <div className="w-full h-2 bg-pink-100 rounded-full">
                          <div className="w-1/3 h-full text-xs text-center text-white bg-pink-400 rounded-full">
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  {/* Activity Card */}
                  <div className="relative w-full sm:w-1/3 p-4 overflow-hidden bg-white shadow-lg rounded-xl dark:bg-gray-800">
                    <div className="flex items-center justify-between w-full mb-8">
                      <p className="text-xl font-normal text-gray-800 dark:text-white">
                        Activity
                      </p>
                      <a href="#" className="flex items-center text-sm text-gray-300 border-0 hover:text-gray-600 dark:text-gray-50 dark:hover:text-white focus:outline-none">
                        VIEW ALL
                      </a>
                    </div>
                    <div className="flex items-start justify-between mb-6 rounded">
                      <span className="p-2 text-white bg-yellow-300 rounded-full dark:text-gray-800">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-128-448v320h-1024v-192l192-192 128 128 384-384zm-832-192q-80 0-136-56t-56-136 56-136 136-56 136 56 56 136-56 136-136 56z">
                          </path>
                        </svg>
                      </span>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start justify-between w-full ml-2 text-sm">
                          <p className="text-gray-700 dark:text-white">
                            <span className="mr-1 font-bold">
                              Logan
                            </span>
                            paid $200 for formal tickets
                          </p>
                          <p className="text-gray-300">
                            Aug 10
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start justify-between rounded">
                      <span className="p-2 text-white bg-yellow-300 rounded-full dark:text-gray-800">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-128-448v320h-1024v-192l192-192 128 128 384-384zm-832-192q-80 0-136-56t-56-136 56-136 136-56 136 56 56 136-56 136-136 56z">
                          </path>
                        </svg>
                      </span>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start justify-between w-full ml-2 text-sm">
                          <p className="text-gray-700 dark:text-white">
                            <span className="mr-1 font-bold">
                            Sid
                            </span>
                            paid $125 for spring term dues
                          </p>
                          <p className="text-gray-300">
                            Aug 1
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Active Projects card */}
                  <div className="relative w-full sm:w-1/3 p-4 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
                    <p className="text-sm font-semibold text-gray-700 border-b border-gray-200 w-max dark:text-white">
                      Payments received this month
                    </p>
                    <div className="flex items-end my-6 space-x-2">
                      <p className="text-5xl font-bold text-black dark:text-white">
                        30
                      </p>
                      <span className="flex items-center text-xl font-bold text-green-500">
                        <ArrowUpIcon className="w-5 h-5 text-green-500" />
                        33%
                      </span>
                      <p className="text-slate-500">
                        vs last month
                      </p>
                    </div>
                    <div className="dark:text-white">
                      <div className="flex items-center justify-between pb-2 space-x-12 text-sm border-b border-gray-200 md:space-x-24">
                        <p>
                          Dues payments
                        </p>
                        <div className="flex items-end text-xs">
                          25
                          <span className="flex items-center">
                            <ArrowUpIcon className="w-4 h-4 text-green-500" />
                            20%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pb-2 space-x-12 text-sm border-b border-gray-200 md:space-x-24">
                        <p>
                          Misc payments
                        </p>
                        <div className="flex items-end text-xs">
                          5
                          <span className="flex items-center">
                            <ArrowUpIcon className="w-4 h-4 text-green-500" />
                            50%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between space-x-12 text-sm md:space-x-24">
                        <p>
                          Food payments
                        </p>
                        <div className="flex items-end text-xs">
                          2
                          <span className="flex items-center">
                            <ArrowUpIcon className="w-4 h-4 text-green-500" />
                            100%
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                {/* Table */}
                <div className="mt-8 mb-8">
                  <h1 className="mb-4 text-3xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                    Upcoming Dues
                  </h1>
                  <Table hoverable={true} className="">
                    <Table.Head>
                      <Table.HeadCell>
                        Name
                      </Table.HeadCell>
                      <Table.HeadCell>
                        Amount
                      </Table.HeadCell>
                      <Table.HeadCell>
                        Due Date
                      </Table.HeadCell>
                      <Table.HeadCell>
                        Status
                      </Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">
                          Edit
                        </span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          Sid
                        </Table.Cell>
                        <Table.Cell>
                          $200
                        </Table.Cell>
                        <Table.Cell>
                          Tomorrow
                        </Table.Cell>
                        <Table.Cell className="flex flex-row gap-2">
                          <Badge className="w-fit" color="success">
                            Active
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                        </Table.Cell>
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
    <div className="flex flex-col items-center justify-center m-72">
      <Spinner size="xl" />
    </div>
  )
}

export default Dashboard;