import Link from "next/link";
import { LogoMark } from "@/shared/components/LogoMark";
import { LinkButton } from "@/shared/components/LinkButton";
import { SITE_NAME } from "@/shared/lib/site";
import type { LandingContent } from "@/features/landing/content";

interface LandingHeaderProps {
  nav: LandingContent["nav"];
}

export function LandingHeader({ nav }: LandingHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-surface-border bg-bg-base/85 backdrop-blur-md"
      // Installed as a PWA the page runs under a translucent status bar, so the
      // bar's own background has to extend up behind it and the nav start below.
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav
        aria-label={SITE_NAME}
        className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5 sm:px-8"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="size-8 rounded-lg" />
          <span className="font-display text-lg font-bold tracking-tight text-text-primary">
            {SITE_NAME}
          </span>
        </Link>

        <ul className="ml-auto hidden items-center gap-7 text-sm text-text-tertiary md:flex">
          <li>
            <a href="#features" className="transition-colors hover:text-text-primary">
              {nav.features}
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="transition-colors hover:text-text-primary">
              {nav.howItWorks}
            </a>
          </li>
          <li>
            <a href="#faq" className="transition-colors hover:text-text-primary">
              {nav.faq}
            </a>
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <Link
            href="/login"
            className="hidden text-sm text-text-tertiary transition-colors hover:text-text-primary sm:block"
          >
            {nav.signIn}
          </Link>
          <LinkButton href="/signup" size="sm">
            {nav.getStarted}
          </LinkButton>
        </div>
      </nav>
    </header>
  );
}
