/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner } from "flowbite-react";
import UserNav from "~/components/UserNav";
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

  const getOrganizationCalendarLink =
    api.organization?.getCalendarLink.useQuery({
      org_id: currentUserOrganization.data?.organizationId ?? "",
    });

  const utils = api.useContext();
  let optimisticUpdate = null;

  const setOrganizationCalendarLink =
    api.organization?.setCalendarLink.useMutation({
      // When mutate is called:
      onMutate: () => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        void utils.organization.getCalendarLink.cancel();
        // Snapshot the previous value
        optimisticUpdate = utils.organization.getCalendarLink.getData();
        // Optimistically update to the new value
        if (optimisticUpdate) {
          utils.organization.getCalendarLink.setData(
            { org_id: currentUserOrganization.data?.organizationId ?? "" },
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
    setCalendarLink(getOrganizationCalendarLink.data?.calendarLink ?? "");
  }, [getOrganizationCalendarLink.isSuccess]);

  if (status === "unauthenticated") {
    void router.push("/");
  }
  if (status === "authenticated") {
    return (
      <>
        <div className="flex h-max w-screen flex-col dark:bg-slate-900">
          <UserNav currentPage={"calendar"} />
          <main className="flex min-h-screen w-screen flex-row justify-center bg-slate-50 dark:bg-slate-700">
            <div className="container mx-16 mt-12 max-w-7xl gap-12">
              <div className="h-full w-full">
                <div className="flex flex-col justify-between sm:flex-row">
                  <div>
                    <h1 className="text-4xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                      Organization Calendar
                    </h1>
                    <p className="text-xl text-slate-500">
                      View your Organization&apos;s calendar and events
                    </p>
                  </div>
                </div>
                {calendarLink.length > 4 ? (
                  <iframe
                    src={calendarLink}
                    className="h-3/4 sm:w-full"
                  ></iframe>
                ) : null}
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
