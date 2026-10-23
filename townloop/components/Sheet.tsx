"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./Icons";

/** Bottom sheet on phones, centred dialog on laptops. Built on <dialog> for focus and Escape handling. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className="m-0 mt-auto w-full max-w-none rounded-t-[16px] bg-white p-0 text-ink backdrop:bg-black/40 md:m-auto md:max-w-lg md:rounded-[16px]"
    >
      <div className="px-5 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="-mr-2 flex size-10 items-center justify-center rounded-full hover:bg-surface">
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </dialog>
  );
}
