"use client";

import { useEffect } from "react";
import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "@/shared/lib/i18n/context";

interface ErrorProps {
  error: Error & { digest?: string };
  /** Re-fetches and re-renders this segment. Named `reset` before Next 16. */
  unstable_retry: () => void;
}

export default function AppError({ error, unstable_retry }: ErrorProps) {
  const { dict } = useTranslation();

  useEffect(() => {
    // The message names a table and a Postgres failure, so it belongs in the
    // logs rather than on screen; `digest` is what ties this render to it.
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-surface-border bg-surface-1 p-6 text-center"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-danger/15">
        <TriangleAlert className="size-5 text-danger" />
      </span>
      <p className="font-display text-base font-semibold text-text-primary">
        {dict.errorBoundary.title}
      </p>
      <p className="text-sm text-text-subtle">{dict.errorBoundary.body}</p>
      <Button variant="outline" size="sm" onClick={() => unstable_retry()} className="mt-1">
        <RotateCw className="size-4" />
        {dict.errorBoundary.retry}
      </Button>
    </div>
  );
}
