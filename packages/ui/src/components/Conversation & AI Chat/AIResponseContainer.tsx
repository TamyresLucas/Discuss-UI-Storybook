import * as React from 'react';

import { cn } from '../../lib/utils';

export interface AIResponseContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Display-font heading at the top of the reply (e.g. "Confirm new project."). */
  title?: React.ReactNode;
  /** Message actions row — a `Timestamp` with copy / like / dislike / retry buttons. */
  actions?: React.ReactNode;
  /** Status line under the reply — an `AIMiniAvatar`. */
  feedback?: React.ReactNode;
}

// Figma: AI Response Container (55) › Chat reply — 16px-gapped column with an h4 title, rich content, actions and AI status.
export const AIResponseContainer = React.forwardRef<HTMLDivElement, AIResponseContainerProps>(
  ({ className, title, children, actions, feedback, ...props }, ref) => (
    <div ref={ref} className={cn('flex w-full max-w-188 flex-col items-start gap-4', className)} {...props}>
      {title && <h2 className="text-heading-h4 text-surface-foreground">{title}</h2>}
      <div className="flex w-full flex-col gap-4 text-body-base text-surface-foreground [&>p]:opacity-90">{children}</div>
      {actions}
      {feedback}
    </div>
  ),
);
AIResponseContainer.displayName = 'AIResponseContainer';
