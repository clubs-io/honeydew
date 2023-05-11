import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Badge, Table, Spinner, Button } from "flowbite-react";
import TailwindNav from "~/components/TailwindNav";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const RequestPage: NextPage = () => {
    return (
    <>
        <div className="w-screen h-max flex flex-col dark:bg-slate-900">
          <TailwindNav currentPage={"payment_requests"} />
          <main className="w-screen flex justify-center min-h-screen flex-row bg-slate-50 dark:bg-slate-700">
            <Button>
                Send Request
            </Button>

          </main>
        </div>
        </>
    );
}
  

export default RequestPage;