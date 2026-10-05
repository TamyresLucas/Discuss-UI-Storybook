import * as React from 'react';

import { cn } from '../../lib/utils';

export interface UserMessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Attached files (`FileAttachment`s) shown above the text. */
  attachments?: React.ReactNode;
  /** Row under the bubble, usually a `Timestamp` with message actions. */
  footer?: React.ReactNode;
}

// Figma: User Message Bubble (54) › Message — `secondary` fill, 16px radius with a 4px bottom-right corner.
export const UserMessageBubble = React.forwardRef<HTMLDivElement, UserMessageBubbleProps>(
  ({ className, children, attachments, footer, ...props }, ref) => (
    <div ref={ref} className={cn('flex w-full max-w-125 flex-col items-end gap-2.5', className)} {...props}>
      <div className="flex w-full flex-col gap-4 rounded-tl-xl rounded-tr-xl rounded-br-xs rounded-bl-xl bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 p-4 text-body-base text-surface-foreground">
        {attachments && <div className="flex flex-wrap gap-4">{attachments}</div>}
        <p className="break-words">{children}</p>
      </div>
      {footer && <div className="w-full">{footer}</div>}
    </div>
  ),
);
UserMessageBubble.displayName = 'UserMessageBubble';
