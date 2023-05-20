/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner } from "flowbite-react";
import TailwindNav from "~/components/AdminNav";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";

const Calendar: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [calendarLink, setCalendarLink] = useState<string>("");
  
  const currentUserOrganization = api.user?.getUserOrganization.useQuery(
    sessionData?.user.id ? sessionData?.user.id : ""
  );

  const getOrganizationCalendarLink = api.organization?.getCalendarLink.useQuery({
    org_id: currentUserOrganization.data?.organizationId ?? ""
  })

  const utils = api.useContext();
  let optimisticUpdate = null;

  const setOrganizationCalendarLink = api.organization?.setCalendarLink.useMutation({
    // When mutate is called:
    onMutate: () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      void utils.organization.getCalendarLink.cancel();
      // Snapshot the previous value
      optimisticUpdate = utils.organization.getCalendarLink.getData();
      // Optimistically update to the new value
      if (optimisticUpdate) {
        utils.organization.getCalendarLink.setData(
          {org_id: currentUserOrganization.data?.organizationId ?? ""},
          optimisticUpdate
        );
      }
    },
    // todo: need to add error case
    // Always refetch after error or success:
    onSettled: () => {
      void utils.organization.getCalendarLink.invalidate();
    },
  });

  useEffect(() => {
    setCalendarLink(getOrganizationCalendarLink.data?.calendarLink ?? "")
  }, [getOrganizationCalendarLink.isSuccess]);


  if (status === "unauthenticated") {
    void router.push("/");
  }
  if (status === "authenticated") {
    return (
      <>
        <div className="flex h-max w-screen flex-col dark:bg-slate-900">
          <TailwindNav currentPage={"calendar"} />
          <main className="flex min-h-screen w-screen flex-row justify-center bg-slate-50 dark:bg-slate-700">
            <div className="container mx-16 mt-12 max-w-7xl gap-12">
              <div className="h-full w-full">
              <p>Calendar Link</p>
              <input
                type="text"
                className="mt-4 block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Outlook or GCal Calendar Link"
                value={calendarLink}
                onChange={(e) =>
                  setCalendarLink(e.target.value)
                }
              />
              <button
                type="submit"
                className="mt-4 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                onClick={() => {
                  setOrganizationCalendarLink.mutate({
                    org_id: currentUserOrganization.data?.organizationId ?? "",
                    calendar_link: calendarLink
                  })
                }}
              >
                Connect Calendar
              </button>
              {
                calendarLink.length > 4 ? 
              (<iframe src={calendarLink}
                className="w-3/4 h-3/4"
              ></iframe>
              ) : null
              }
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

export default Calendar;
