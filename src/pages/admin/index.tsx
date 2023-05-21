/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { DataTable } from "~/components/data-table";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import {
  PlusIcon,
  CurrencyDollarIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

const statusColorMap: { [key: string]: string } = {
  OVERDUE: "bg-yellow-50 text-yellow-800",
  PENDING: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-700",
};

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
  
    const columns: ColumnDef<PaymentRequest>[] = [
      {
        accessorKey: "userId",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const userId = row.getValue("userId");
          const userName = orgMembers?.find((member) => member.id === userId)?.name;
          return (
            <div className="flex items-center">
              {userName}
              </div>
          )
    
        },
      },
      {
        accessorKey: "dueBy",
        header: "Due by",
        cell: ({ row }) => {
          const dueDate: Date = row.getValue("dueBy");
          const formatted = dueDate.toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            },
          );
    
          return <div className="font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status: string = row.getValue("status");
          const colorClass: string =
            statusColorMap[status] || "bg-gray-50 text-gray-600"; // Fallback color
    
          return (
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${colorClass}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <ArrowsUpDownIcon className="mr-2 h-4 w-4" />
              Amount
            </Button>
          );
        },
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);
    
          return <div className="font-medium">{formatted}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const payment = row.original;
    
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                  Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

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
                  <div className="mb-8 mt-8">
                    <DataTable columns={columns} data={paymentRequests?.paymentRequest ?? []} />
                  </div>
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
