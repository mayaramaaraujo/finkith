"use client";

import { useEffect } from "react";
import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "@/shared/lib/i18n/context";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

/**
 * Catches everything the nested `(app)/error.tsx` can't: an error boundary
 * doesn't wrap the layout of its own segment, so a failure inside
 * `(app)/layout.tsx` — where the group and its members are loaded — lands
 * here, as do the routes outside the app chrome (/setup, /join, /login).
 */
export default function RootError({ error, unstable_retry }: ErrorProps) {
  const { dict } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-danger/15">
        <TriangleAlert className="size-6 text-danger" />
      </span>
      <h1 className="font-display text-xl font-bold text-text-primary">
        {dict.errorBoundary.title}
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-text-subtle">{dict.errorBoundary.body}</p>
      <Button variant="outline" size="sm" onClick={() => unstable_retry()} className="mt-2">
        <RotateCw className="size-4" />
        {dict.errorBoundary.retry}
      </Button>
    </div>
  );
}
