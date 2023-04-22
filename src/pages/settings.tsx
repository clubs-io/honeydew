import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Fragment, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useState, useRef } from "react";
import { Button, Checkbox, Label, Modal, Spinner, Tabs, TextInput } from "flowbite-react";
import { PlusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from '@headlessui/react'
import TailwindNav from "~/components/TailwindNav";
import { useRouter } from "next/router";
import { UserRole } from "@prisma/client";

const Settings: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [emailInviteValue, setEmailInviteValue] = useState("");
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
  const { data: orgInvites } =
    api.organization?.getOrganizationInvitations.useQuery({
      user_id: sessionData?.user.id ? sessionData?.user.id : "",
      organization_id: currentUserOrganization.data?.organizationId
        ? currentUserOrganization.data?.organizationId
        : null,
    });
  const inviteMember = api.invite?.createInvite.useMutation();

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const mutateInviteMember = () => {
    inviteMember.mutate({
      email: emailInviteValue,
      orgId: currentUserOrganization.data?.organizationId
        ? Number(currentUserOrganization.data?.organizationId)
        : 0,
      orgName: "HoneyDew",
    });
  };

  // Function to find the role by email
  function findRoleByEmail(users: { id: string; role: UserRole; name: string | null; email: string | null; }[], emailToFind: string): UserRole | null {
    const user = users.find(user => user.email === emailToFind);
    return user ? user.role : "MEMBER";
  }

  const userRole = (!sessionData || !orgMembers) ? "MEMBER" : findRoleByEmail(orgMembers, sessionData.user?.email ? sessionData.user?.email : "");
  const isAdminOrHigher = (userRole === "ADMIN" || userRole === "OWNER") ? true : false
  if (status === "unauthenticated"){
    void router.push("/")
  }
  if (status === "authenticated" && isAdminOrHigher){
    return (
      <>
        <div className="flex h-max w-screen flex-col dark:bg-slate-900">
          <TailwindNav currentPage={"settings"} />
          <main className="w-screen justify-center flex min-h-screen flex-row bg-slate-50 dark:bg-slate-800">
            <div className="container flex flex-col gap-12 px-4 py-8 max-w-7xl">
              <h1 className="text-4xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                Settings
              </h1>
              <Tabs.Group aria-label="Tabs with underline" style="underline">
                <Tabs.Item title="Members">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-2xl text-slate-900 dark:text-slate-100">Team members</h1>
                      <p className="text-lg text-slate-500">
                        Manage your organization&apos;s members and account permissions here.
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        onClick={() => setOpen(true)}
                      >
                        <PlusIcon className="h-6 w-6 mr-2" />
                        Add team member
                      </button>
                    </div>
                  </div>
                  <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                  <div className="w-full flex flex-row">
                    <h1 className="w-60 text-slate-500 font-semibold">Active</h1>
                    <table className="w-full max-w-xl text-left text-sm text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgMembers &&
                          orgMembers?.map(
                            (member: {
                              id: Key | null | undefined;
                              name:
                              | string
                              | number
                              | boolean
                              | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                              | ReactFragment
                              | ReactPortal
                              | null
                              | undefined;
                              role:
                              | string
                              | number
                              | boolean
                              | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                              | ReactFragment
                              | ReactPortal
                              | null
                              | undefined;
                            }) => {
                              return (
                                <tr key={member.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {member.name}
                                  </th>
                                  <td>{member.role}</td>
                                </tr>
                              );
                            }
                          )}
                      </tbody>
                    </table>
                  </div>
                  <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                  <div className="w-full flex flex-row">
                    <h1 className="w-60 text-slate-500 font-semibold">Invites</h1>
                    <table className="w-full max-w-xl text-left text-sm text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgInvites &&
                          orgInvites?.map((invite) => {
                            return (
                              <tr key={invite.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {invite.email}
                                </th>
                                <td>{invite.status}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </Tabs.Item>
                <Tabs.Item title="Other">
                  <h1 className="text-2xl text-slate-900">Other settings</h1>
                  <p className="text-lg text-slate-500">
                    Manage your other settings
                  </p>
                </Tabs.Item>
              </Tabs.Group>
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
                      <form className="" onSubmit={mutateInviteMember}>
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
                                Invite a member
                              </Dialog.Title>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Add others from your organization to this
                                  project.
                                </p>
                                <input
                                  type="text"
                                  name="price"
                                  id="price"
                                  className="mt-4 block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="johndoe@gmail.com"
                                  value={emailInviteValue}
                                  onChange={(e) =>
                                    setEmailInviteValue(e.target.value)
                                  }
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
  }
  return (
    <div className="flex flex-col items-center justify-center m-72">
      <Spinner size="xl" />
    </div>
  )
};

export default Settings;
