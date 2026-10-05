import * as React from 'react';
import { X } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';

export interface FileAttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** File type badge text, e.g. "PDF". */
  type?: string;
  /** Shows the round remove button on hover or keyboard focus (Figma: Default). Omit for the sent-message card (Figma: Variant 3). */
  onRemove?: () => void;
  removeLabel?: string;
}

// Figma: User Message Bubble (54) › File attached — 128px card; the composer variant has a remove button.
export const FileAttachment = React.forwardRef<HTMLDivElement, FileAttachmentProps>(
  ({ className, name, type, onRemove, removeLabel, ...props }, ref) => (
    <div ref={ref} className={cn('group/file relative w-32 shrink-0', className)} {...props}>
      <div
        className={cn(
          'flex flex-col gap-1.5 border border-border bg-surface px-2.5 pt-2.5 pb-3',
          onRemove ? 'rounded-xl' : 'rounded-lg',
        )}
      >
        <p className="line-clamp-2 min-h-8 break-all text-ui-caption text-surface-foreground" title={name}>
          {name}
        </p>
        {type && (
          <span className="w-fit rounded-xs bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 px-1.5 py-px text-body-xxs font-semibold tracking-wider text-secondary-muted-foreground uppercase">
            {type}
          </span>
        )}
      </div>
      {onRemove && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={removeLabel ?? `Remove ${name}`}
          onClick={onRemove}
          className="absolute right-0 bottom-0 rounded-full opacity-0 transition-opacity group-hover/file:opacity-100 group-focus-within/file:opacity-100"
        >
          <X size={16} aria-hidden />
        </Button>
      )}
    </div>
  ),
);
FileAttachment.displayName = 'FileAttachment';
