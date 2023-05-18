/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextPage } from "next";
import { Fragment, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import TailwindNav from "~/components/TailwindNav";
import { Badge, Spinner, Table } from "flowbite-react";
import { useSession } from "next-auth/react";
import {
  ArrowUpIcon,
  UserPlusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-select";

const UpgradeButton = () => {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const { push } = useRouter();
  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
      onClick={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { checkoutUrl } = await createCheckoutSession();
        if (checkoutUrl) {
          void push(checkoutUrl);
        }
      }}
    >
      Upgrade account
    </button>
  );
};

const CreatePaymentButton = () => {
  // const { mutateAsync: createCheckoutSession } =
  //   api.stripe.createCheckoutSession.useMutation();
  // const { push } = useRouter();
  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
      onClick={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //   const { checkoutUrl } = await createCheckoutSession();
        //   if (checkoutUrl) {
        //     void push(checkoutUrl);
        //   }
      }}
    >
      Upgrade account
    </button>
  );
};

const ManageBillingButton = () => {
  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();
  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
      onClick={async () => {
        const { billingPortalUrl } = await createBillingPortalSession();
        if (billingPortalUrl) {
          void push(billingPortalUrl);
        }
      }}
    >
      Manage subscription and billing
    </button>
  );
};

const AdminPayments: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const [paymentIdalue, setPaymentIdValue] = useState("");
  const [paymentAmountValue, setPaymentAmountValue] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  console.log("👀DATE ->>> ", paymentDate);

  const inviteMember = api.invite?.createInvite.useMutation();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const createPayment = api.paymentRequest?.createPaymentRequest.useMutation();
  const currentUserOrganization = api.user?.getUserOrganization.useQuery(
    sessionData?.user.id ? sessionData?.user.id : ""
  );
  const currentUserOrganizationStripeAccount =
    api.organization?.getOrganizationStripeId.useQuery(
      currentUserOrganization.data?.organizationId
        ? currentUserOrganization.data?.organizationId
        : ""
    );
  const { data: orgMembers, isSuccess } =
    api.organization?.getOrganizationUsers.useQuery({
      user_id: sessionData?.user.id ? sessionData?.user.id : "",
      organization_id: currentUserOrganization.data?.organizationId
        ? currentUserOrganization.data?.organizationId
        : null,
    });
  const { data: orgInvites } =
    api.organization?.getOrganizationInvitations.useQuery({
      user_id: sessionData?.user.id ? sessionData?.user.id : "",
      organization_id: currentUserOrganization.data?.organizationId
        ? currentUserOrganization.data?.organizationId
        : null,
    });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value ? new Date(e.target.value) : null;
    setPaymentDate(dateValue);
  };

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  // eslint-disable-next-line prefer-const
  // let users = orgMembers;
  // console.log(users);

  // const handleSubmitRfq = (e: React.SyntheticEvent) => {
  const mutateCreatePaymentRequest = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createPayment.mutate({
      user_id: paymentIdalue,
      organization_id: currentUserOrganization.data?.organizationId
        ? currentUserOrganization.data?.organizationId
        : "",
      amount: +paymentAmountValue,
      due_by: paymentDate,
    });
  };

  const { push } = useRouter();
  const {
    data: subscriptionStatus,
    isLoading,
    isError,
  } = api.user.subscriptionStatus.useQuery();
  //type Option = { value: string; label: string };

  // eslint-disable-next-line prefer-const
  // let options: Option[] = [];
  // eslint-disable-next-line prefer-const
  //let options: { value: string; label: string }[] = [];
  // eslint-disable-next-line prefer-const
  let options: any = [];
  useEffect(() => {
    if (orgMembers) {
      for (let i = 0; i < orgMembers.length; i++) {
        options.push({
          value: orgMembers[i]?.id ?? "",
          label: orgMembers[i]?.name ?? "",
        });
      }
      console.log(options);
    }
  }, [options, orgMembers]);
  console.log(options);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Please Contact Support for Help!</div>;
  }
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
                      <div>
                        {!isLoading && subscriptionStatus !== null && (
                          <>
                            <ManageBillingButton />
                          </>
                        )}
                        {!isLoading && subscriptionStatus === null && (
                          <>
                            <p className="text-xl text-gray-700">
                              You are not subscribed!!!
                            </p>
                            <UpgradeButton />
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>no session data</p>
                  )}
                  <div>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(true)}
                    >
                      <PlusIcon className="mr-2 h-6 w-6" />
                      Create Payment Request
                    </button>
                  </div>
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
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              initialFocus={cancelButtonRef}
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <form className="" onSubmit={mutateCreatePaymentRequest}>
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                              <UserPlusIcon
                                className="h-6 w-6 text-blue-600"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <Dialog.Title
                                as="h3"
                                className="text-base font-semibold leading-6 text-gray-900"
                              >
                                Payment Request Form
                              </Dialog.Title>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Create a payment request from a user.
                                </p>
                                <Select
                                  defaultValue={[]}
                                  name="members"
                                  options={options}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                //   onChange={}
                                  onChange={(e) =>
                                    //eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                    setPaymentIdValue(e.value)
                                    // console.log(e);
                                  }
                                />

                                <p>Amount To Be Requested</p>
                                <input
                                  type="text"
                                  name="price"
                                  id="price"
                                  className="mt-4 block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="10"
                                  value={paymentAmountValue}
                                  onChange={(e) =>
                                    setPaymentAmountValue(e.target.value)
                                  }
                                />
                                <p>Due Date</p>
                                <input
                                  type="date"
                                  name="price"
                                  id="date"
                                  className="mt-4 block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="May 11th"
                                  value={
                                    paymentDate?.toString()
                                  }
                                  onChange={handleDateChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Invite
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpen(false)}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </>
    );
  } else {
    return (
      <div className="m-72 flex flex-col items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }
};

export default AdminPayments;
