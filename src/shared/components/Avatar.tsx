const AVATAR_GRADIENT_CLASSES = [
  "avatar-gradient-1",
  "avatar-gradient-2",
  "avatar-gradient-3",
  "avatar-gradient-4",
  "avatar-gradient-5",
  "avatar-gradient-6",
] as const;

/** Index into the app's 6-color cycling avatar palette (defined in globals.css). */
export type AvatarColorIndex = 0 | 1 | 2 | 3 | 4 | 5;

/** Cycle length for callers colouring a list: `(i % AVATAR_COLOR_COUNT)`. */
export const AVATAR_COLOR_COUNT = AVATAR_GRADIENT_CLASSES.length;

const SIZE_CLASSES = {
  sm: "size-6 text-xs",
  md: "size-8 text-xs",
  lg: "size-9 text-sm",
} as const;

export type AvatarSize = keyof typeof SIZE_CLASSES;

interface AvatarProps {
  initials: string;
  colorIndex: AvatarColorIndex;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ initials, colorIndex, size = "md", className = "" }: AvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold text-text-primary ${SIZE_CLASSES[size]} ${AVATAR_GRADIENT_CLASSES[colorIndex]} ${className}`}
    >
      {initials}
    </span>
  );
}
