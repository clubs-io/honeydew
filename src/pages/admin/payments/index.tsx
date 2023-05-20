/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextPage } from "next";
import { Fragment, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import TailwindNav from "~/components/AdminNav";
import { Badge, Spinner, Table } from "flowbite-react";
import { useSession } from "next-auth/react";
import {
  ArrowUpIcon,
  UserPlusIcon,
  PlusIcon,
  CurrencyDollarIcon,
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
  // console.log()
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
          <TailwindNav currentPage={"payments"} />
          <main className="flex min-h-screen w-screen flex-row justify-center bg-slate-50 dark:bg-slate-700">
            <div className="container mx-16 mt-12 max-w-7xl gap-12">
              <div className="h-full w-full">
                {/* Header */}
                <div className="flex flex-col justify-between sm:flex-row">
                  <div>
                    <h1 className="text-4xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                      Track Payments
                    </h1>
                    <p className="text-xl text-slate-500">
                      Track and manage your Organization&apos;s Payments
                    </p>
                    {/* <div>
                        {!isLoading && subscriptionStatus !== null && (
                          <>
                            <p>Sub: {subscriptionStatus?.stripeSubscriptionStatus}</p>
                            <UpgradeButton />
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
                      </div> */}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(true)}
                    >
                      <PlusIcon className="mr-2 h-6 w-6" />
                      New Payment Request
                    </button>
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
                        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                              <CurrencyDollarIcon
                                className="h-6 w-6 text-blue-600"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                              <div>
                                <Dialog.Title
                                  as="h3"
                                  className="text-base font-semibold leading-6 text-gray-900"
                                >
                                  Payment Request Form
                                </Dialog.Title>
                                <p className="text-sm text-gray-500">
                                  Create a payment request from a user.
                                </p>
                                <hr className="my-4 h-px w-full border-0 bg-gray-200" />
                              </div>
                              <div className="">
                                <p className="text-sm text-gray-800">
                                  Select user
                                </p>
                                <Select
                                  defaultValue={[]}
                                  name="members"
                                  options={options}
                                  className="basic-multi-select mt-1"
                                  classNamePrefix="select"
                                  //   onChange={}
                                  onChange={
                                    (e: any) =>
                                      //eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                      setPaymentIdValue(e.value)
                                    // console.log(e);
                                  }
                                />
                                <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                                <div className="">
                                  <p className="text-sm text-gray-800">
                                    Enter amount
                                  </p>
                                  <input
                                    type="text"
                                    name="price"
                                    id="price"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="10"
                                    value={paymentAmountValue}
                                    onChange={(e) =>
                                      setPaymentAmountValue(e.target.value)
                                    }
                                  />
                                </div>
                                <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                                <div className="">
                                  <p className="text-sm text-gray-800">
                                    Due by
                                  </p>
                                  <input
                                    type="date"
                                    name="price"
                                    id="date"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="May 11th"
                                    value={paymentDate?.toString()}
                                    onChange={handleDateChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="submit"
                            className="px-10 inline-flex w-full justify-center rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Create
                          </button>
                          <button
                            type="button"
                            className=" inline-flex w-full justify-center rounded-md bg-white px-10 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
