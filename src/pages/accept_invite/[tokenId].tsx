import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

export default function InviteAccepted() {
  const router = useRouter();
  const { tokenId } = router.query;
  const updateUserOrg = api.invite?.acceptInvite.useMutation();
  useEffect(() => {
    updateUserOrg.mutate({ tokenId: String(tokenId) });
  }, [tokenId]);
  return (
    <div>
      <h1>Invite Accepted!</h1>
      <button
        onClick={() => {
          void router.push("/");
        }}
      >
        Continue to HoneyDew
      </button>
    </div>
  );
}
