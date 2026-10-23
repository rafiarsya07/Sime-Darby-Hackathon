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
      className="m-0 mt-auto w-full max-w-none rounded-t-[28px] bg-white p-0 text-ink backdrop:bg-night/50 backdrop:backdrop-blur-[2px] md:m-auto md:max-w-lg md:rounded-[28px]"
    >
      <div className="px-5 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[17px] font-semibold tracking-[-0.03em]">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="-mr-1 flex size-10 items-center justify-center rounded-full bg-surface hover:bg-line">
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </dialog>
  );
}
