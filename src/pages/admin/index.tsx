/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner } from "flowbite-react";
import TailwindNav from "~/components/AdminNav";
import { useRouter } from "next/router";
import {
  ArrowUpIcon,
  DocumentChartBarIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const currentUserOrganization = api.user?.getUserOrganization.useQuery(
    sessionData?.user.id ? sessionData?.user.id : ""
  );

  const { data: orgMembers, isLoading } =
    api.organization?.getOrganizationUsers.useQuery({
      user_id: sessionData?.user.id ? sessionData?.user.id : "",
      organization_id: currentUserOrganization.data?.organizationId
        ? currentUserOrganization.data?.organizationId
        : null,
    });

  const { data: paymentRequests } =
    api.paymentRequest.getAllOrgPaymentRequests.useQuery(
      currentUserOrganization.data?.organizationId
        ? currentUserOrganization.data?.organizationId
        : ""
    );

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
                <div className="mt-8 flex flex-col items-center justify-start gap-4 sm:flex-row">
                  {/* Card 1 */}
                  <Link
                    className="shaod-sm flex w-full flex-col gap-6 overflow-hidden rounded-lg bg-sky-100 p-6 shadow-sm sm:w-1/3"
                    href={"/settings"}
                  >
                    <div className="flex flex-row justify-between">
                      <div className="w-fit rounded-lg p-3">
                        <UsersIcon className="h-6 w-6 text-gray-800" />
                      </div>
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-gray-600">No. Members</h3>
                      <div className="flex w-full flex-row items-center justify-between">
                        <span className="text-4xl font-semibold text-gray-800">
                          {orgMembers?.length ?? "1"}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="shaod-sm flex w-full flex-col gap-6 overflow-hidden rounded-lg bg-orange-100 p-6 shadow-sm sm:w-1/3">
                    <div className="flex flex-row justify-between">
                      <div className="w-fit rounded-lg p-3">
                        <UsersIcon className="h-6 w-6 text-gray-800" />
                      </div>
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-gray-600">Dues requested</h3>
                      <div className="flex w-full flex-row items-center justify-between">
                        <span className="text-4xl font-semibold text-gray-800">
                          ${paymentRequests?.paymentRequest ? 
                          paymentRequests?.paymentRequest.reduce((sum, obj) => sum + obj.amount, 0)
                           : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shaod-sm flex w-full flex-col gap-6 overflow-hidden rounded-lg bg-pink-100 p-6 shadow-sm sm:w-1/3">
                    <div className="flex flex-row justify-between">
                      <div className="w-fit rounded-lg p-3">
                        <UsersIcon className="h-6 w-6 text-gray-800" />
                      </div>
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-gray-600">Dues collected</h3>
                      <div className="flex w-full flex-row items-center justify-between">
                        <span className="text-4xl font-semibold text-gray-800">
                          ${paymentRequests?.paymentRequest ? 
                          paymentRequests?.paymentRequest
                          .filter(obj => obj.status === "COMPLETED")
                          .reduce((sum, obj) => sum + obj.amount, 0)
                          : "-"}
                        </span>
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
