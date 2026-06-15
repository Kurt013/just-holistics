"use client";

import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import NewThreadModal from "./NewThreadModal";

export default function ThreadModalTrigger({
  protocolId,
}: {
  protocolId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <PlusCircleIcon className="h-6 w-6 text-slate-400" />
      </button>

      <NewThreadModal
        protocolId={protocolId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}