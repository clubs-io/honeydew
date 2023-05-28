/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Spinner } from "flowbite-react";
import UserNav from "~/components/UserNav";
import {
  ArrowRightCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { api } from "../../utils/api";
import { Transition, Dialog } from "@headlessui/react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";

type MyComponentProps = {
  paymentAmount: number;
  description: string;
  paymentRequestId: string;
};

const FulFillPayment: React.FC<MyComponentProps> = ({
  paymentAmount,
  description,
  paymentRequestId,
}) => {
  const { push } = useRouter();
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();

  return (
    <Button
      variant="outline"
      onClick={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { checkoutUrl } = await createCheckoutSession({
          priceAmount: Number(paymentAmount),
          description: String(description),
          paymentRequestId: String(paymentRequestId),
        });
        if (checkoutUrl) {
          void push(checkoutUrl);
        }
      }}
    >
      Pay
      <ArrowRightCircleIcon className="ml-2 h-4 w-4" />
    </Button>
  );
};

const Dashboard: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [paymentAmountValue, setPaymentAmountValue] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const { data: paymentRequests } = api.user?.getUserPaymentRequests.useQuery(
    sessionData?.user.id ? sessionData?.user.id : ""
  );

  const handleAfterPayment = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // console.log("Got Called");
  };

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  type OptionType = {
    label: string;
    value: number;
    id: string;
    dueBy: string;
  };

  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    if (paymentRequests) {
      const newOptions = paymentRequests.paymentRequests.map((request) => {
        return {
          label: request?.description ?? "",
          value: request?.amount ?? 0,
          id: request?.id ?? "",
          dueBy: String(request?.dueBy) ?? "",
        };
      });
      setOptions(newOptions);
    }
  }, [paymentRequests]);

  if (status === "unauthenticated") {
    void router.push("/");
  }
  if (status === "authenticated") {
    return (
      <>
        <div className="flex h-max w-screen flex-col ">
          <UserNav currentPage={"user"} />
          <main className="flex min-h-screen w-screen flex-row justify-center bg-white dark:bg-slate-700">
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
                </div>
                <div className="flex flex-row gap-12">
                  <div className="mb-8 mt-8 w-96">
                    <h1 className="mb-4 text-3xl font-medium text-gray-700 dark:text-slate-100 sm:block">
                      Overview
                    </h1>
                    <div className="mt-8 rounded-md border p-4">
                      <div className="flex flex-row justify-between">
                        <p className="text-xl text-gray-700">Current balance</p>
                        <h1 className="text-3xl font-semibold text-gray-700">
                        $
                          {paymentRequests?.paymentRequests
                            ? paymentRequests?.paymentRequests
                              .filter((obj) => obj.status === "PENDING")
                              .reduce(
                                (sum, obj) => sum + obj.amount,
                                0
                              )
                            : "-"}
                        </h1>
                      </div>
                    </div>
                  </div>
                  {/* Table */}
                  <div className="mb-8 mt-8">
                    <div className="flex w-full flex-row justify-between">
                      <h1 className="mb-4 text-3xl font-medium text-gray-700 dark:text-slate-100 sm:block">
                        Pending Dues
                      </h1>
                    </div>
                    {/* Table */}
                    <div className="mt-4 w-fit rounded-md border">
                      <Table className="">
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="w-[100px]">Payment</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due by</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {options?.map((option: any) => {
                            return (
                              <TableRow key={option.label}>
                                <TableCell className="w-96">
                                  {option.label}
                                </TableCell>
                                <TableCell>{option.value}</TableCell>
                                <TableCell>{option.dueBy.substring(0, 10)}</TableCell>
                                <TableCell>
                                  <FulFillPayment
                                    paymentAmount={Number(option.value)}
                                    description={String(option.label)}
                                    paymentRequestId={String(option.id)}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
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
                      <form
                        className="flex h-96 flex-col justify-between"
                        onSubmit={handleAfterPayment}
                      >
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
                                Fulfill Request Form
                                <p className="text-sm text-gray-500">
                                  Pick which request to fulfill
                                </p>
                              </Dialog.Title>
                              <div className="mt-4">
                                {/* <Select */}
                                {/*   defaultValue={0} */}
                                {/*   name="requests" */}
                                {/*   options={options} */}
                                {/*   className="basic-multi-select" */}
                                {/*   classNamePrefix="select" */}
                                {/*   onChange={(e: any) => { */}
                                {/*     setPaymentAmountValue(e.value); */}
                                {/*     setPaymentDescription(e.label); */}
                                {/*   }} */}
                                {/* /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          {/* <FulFillPayment
                            paymentAmount={Number(paymentAmountValue)}
                            description={String(paymentDescription)}
                          ></FulFillPayment> */}
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
  }
  return (
    <div className="m-72 flex flex-col items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
};

export default Dashboard;
