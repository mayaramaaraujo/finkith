import Link from "next/link";
import type { ReactNode } from "react";
import {
  BUTTON_BASE_CLASSES,
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
  type ButtonSize,
  type ButtonVariant,
} from "@/shared/lib/button-styles";

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full width on small screens, intrinsic width from `sm:` up. */
  fullWidthOnMobile?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * A link that looks like a `Button`. Kept separate rather than a `as` prop on
 * `Button` because that one is a client component rendering a real `<button>`,
 * while these are plain navigations a server component can render.
 */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  fullWidthOnMobile = false,
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${BUTTON_BASE_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${BUTTON_SIZE_CLASSES[size]} ${fullWidthOnMobile ? "w-full sm:w-auto" : ""} ${className}`}
    >
      {children}
    </Link>
  );
}
