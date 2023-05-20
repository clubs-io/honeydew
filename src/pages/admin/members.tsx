import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner } from "flowbite-react";
import TailwindNav from "~/components/TailwindNav";
import { useRouter } from "next/router";

const Members: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    void router.push("/");
  }
  if (status === "authenticated") {
    return (
      <>
        <div className="flex h-max w-screen flex-col dark:bg-slate-900">
          <TailwindNav currentPage={"members"} />
          <main className="flex min-h-screen w-screen flex-row justify-center bg-slate-50 dark:bg-slate-700">
          <div className="mb-8 mt-8">
                  <h1 className="mb-4 text-3xl font-medium text-slate-800 dark:text-slate-100 sm:block">
                    Members</h1>
                  <Table hoverable={true} className="">
                    <Table.Head>
                      <Table.HeadCell>Name</Table.HeadCell>
                      <Table.HeadCell>Email</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Actions</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          Sid
                        </Table.Cell>
                        <Table.Cell>xyz@gmail.com</Table.Cell>
                        <Table.Cell>
                        <Badge className="w-fit" color="success">
                            Active
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="flex flex-row gap-2">
                          Cool
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
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

export default Members;
