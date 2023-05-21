import { type NextPage } from "next";
import { Button } from "flowbite-react";
import TailwindNav from "~/components/AdminNav";

const RequestPage: NextPage = () => {
  return (
    <>
      <div className="flex h-max w-screen flex-col dark:bg-slate-900">
        <TailwindNav currentPage={"payment_requests"} />
        <main className="flex min-h-screen w-screen flex-row justify-center bg-slate-50 dark:bg-slate-700">
          <Button>Send Request</Button>
        </main>
      </div>
    </>
  );
};

export default RequestPage;
