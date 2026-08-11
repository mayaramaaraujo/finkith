"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslation } from "@/shared/lib/i18n/context";

const subscribeNoop = () => () => {};

/** True only once mounted in the browser — avoids a portal target mismatch during SSR. */
function useIsMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  const mounted = useIsMounted();
  const { dict } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        role="presentation"
        onClick={onClose}
        className="animate-dim-in absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet-in absolute inset-x-0 bottom-0 mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-surface-border bg-bg-sheet px-5 pt-3 pb-8"
      >
        <div className="mx-auto mb-4 h-1.5 w-9 rounded-full bg-surface-4" />
        {title ? (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-text-primary">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label={dict.common.close}
              className="flex size-8 items-center justify-center rounded-full bg-surface-3 text-text-icon"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
