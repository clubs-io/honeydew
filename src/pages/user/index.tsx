/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner } from "flowbite-react";
// import TailwindNav from "~/components/AdminNav";
import UserNav from "~/components/UserNav";
import { ArrowUpIcon,  PlusIcon, UserPlusIcon, } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { api } from "../../utils/api";
// import TailwindNav from "~/components/AdminNav";
import { Transition, Dialog } from "@headlessui/react";
import Select from "react-select";

type MyComponentProps = {
  paymentAmount: number;
};

const FulFillPayment: React.FC<MyComponentProps> = ({ paymentAmount }) => {
  const { push } = useRouter();
  const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation();
  

  return (
    <button
      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
      onClick={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { checkoutUrl } = await createCheckoutSession({priceAmount: Number(paymentAmount)});
        if (checkoutUrl) {
          void push(checkoutUrl);
        }
      }}
    >
      Pay
    </button>
  );
};

const Dashboard: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [paymentIdValue, setPaymentIdValue] = useState("");
  const [paymentAmountValue, setPaymentAmountValue] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const { data: paymentRequests } = api.user?.getUserPaymentRequests.useQuery(
    sessionData?.user.id ? sessionData?.user.id : ""
  );

  const handleAfterPayment = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // console.log("Got Called");
  };

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  
  let options: any = [];
  useEffect(() => {
    if (paymentRequests) {
      for (let i = 0; i < paymentRequests.paymentRequests.length; i++) {
        // { value: 'chocolate', label: 'Chocolate' }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        options.push({
          value: paymentRequests.paymentRequests[i]?.id ?? "",
          label: paymentRequests.paymentRequests[i]?.amount ?? "",
        });
      }
      console.log(options);
    }
  }, [options, paymentRequests]);
  if (status === "unauthenticated"){
    void router.push("/")
  }
  if (status === "authenticated"){
    return (
      <>
        <div className="w-screen h-max flex flex-col dark:bg-slate-900">
          <UserNav currentPage={"user"} />
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
                {/*                 
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
                 */}
                {/* Table */}
                <div className="mt-8 mb-8">
                  <h1 className="mb-4 text-3xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                    Upcoming Dues
                  </h1>
                  <div>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(true)}
                    >
                      <PlusIcon className="mr-2 h-6 w-6" />
                      Fulfill a Payment Request
                    </button>
                  </div>
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
                <div className="mt-8 mb-8">
                  <h1 className="mb-4 text-3xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                    History
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
                      <form className="" onSubmit={(handleAfterPayment)}>
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
                              </Dialog.Title>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Pick which request to fulfill
                                </p>
                                <Select
                                  defaultValue={0}
                                  name="requests"
                                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                  options={options}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  //   onChange={}
                                  onChange={
                                    (e: any) =>{
                                      //eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                      setPaymentAmountValue(e.label);
                                      // console.log(e.label);
                                      // console.log(paymentAmountValue);
                                    }
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <FulFillPayment paymentAmount={Number(paymentAmountValue)}></FulFillPayment>
                          {/* <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Pay
                          </button> */}
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
    <div className="flex flex-col items-center justify-center m-72">
      <Spinner size="xl" />
    </div>
  )
}

export default Dashboard;