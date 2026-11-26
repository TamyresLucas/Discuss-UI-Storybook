import * as React from 'react';

import { cn } from '../../lib/utils';

export interface OrgMonogramProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The organization's initial(s). */
  children: React.ReactNode;
}

/** The organization's monogram (Figma "Org Monogram"), e.g. in a primary `NavRail`'s header: a 40px coral square with the initial in white. */
export const OrgMonogram = React.forwardRef<HTMLSpanElement, OrgMonogramProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('flex size-10 shrink-0 items-center justify-center rounded-md bg-coral-500 text-ui-label font-semibold text-surface', className)} {...props} />
));
OrgMonogram.displayName = 'OrgMonogram';
