/**
 * The button look, shared by `Button` (a client `<button>`) and `LinkButton`
 * (a server-renderable `<a>`). It lives here rather than in `Button.tsx`
 * because that file is `"use client"`: a Server Component importing its values
 * gets an opaque client reference instead of the class strings.
 */
export const BUTTON_VARIANT_CLASSES = {
  primary: "bg-gradient-to-br from-primary to-primary-dark text-text-primary shadow-glow-primary",
  secondary: "bg-white text-zinc-900",
  outline: "border border-surface-border bg-surface-2 text-text-primary",
  danger: "bg-danger/12 text-danger",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT_CLASSES;

export const BUTTON_SIZE_CLASSES = {
  sm: "h-11 text-sm",
  md: "h-14 text-sm",
} as const;

export type ButtonSize = keyof typeof BUTTON_SIZE_CLASSES;

export const BUTTON_BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 font-display font-semibold transition-opacity";
