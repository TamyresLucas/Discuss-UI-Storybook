import * as React from 'react';

import { cn } from '../../lib/utils';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The person's photo. Without one, or if it fails to load, the initials show. */
  src?: string;
  /** Who it is (the image's alt text, and the accessible name of the initials). */
  name: string;
  /** Shown when there is no photo; defaults to the first letters of the first two words of `name`. */
  fallback?: string;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** A person's picture (Figma "Avatar"): a 40px rounded square on orchid-200 with the photo covering it, or their initials. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(({ className, src, name, fallback, ...props }, ref) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  const showImage = Boolean(src) && !failed;
  return (
    <span
      ref={ref}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : name}
      className={cn('flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-orchid-200 text-ui-label text-surface-foreground', className)}
      {...props}
    >
      {showImage ? <img src={src} alt={name} className="size-full object-cover" onError={() => setFailed(true)} /> : <span aria-hidden="true">{fallback ?? initials(name)}</span>}
    </span>
  );
});
Avatar.displayName = 'Avatar';
