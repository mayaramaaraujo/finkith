import { Compass } from "lucide-react";
import { LinkButton } from "@/shared/components/LinkButton";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

export default async function NotFound() {
  const dict = getDictionary(await getLocale());

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15">
        <Compass className="size-6 text-primary-light" />
      </span>
      <h1 className="font-display text-xl font-bold text-text-primary">{dict.notFound.title}</h1>
      <p className="max-w-sm text-sm leading-relaxed text-text-subtle">{dict.notFound.body}</p>
      <LinkButton href="/" size="sm" className="mt-2">
        {dict.notFound.home}
      </LinkButton>
    </div>
  );
}
