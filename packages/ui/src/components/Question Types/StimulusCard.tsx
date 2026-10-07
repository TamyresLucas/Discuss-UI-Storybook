import * as React from 'react';
import { Image as ImageIcon, ImageBroken, Trash } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { InlineEdit } from '../Forms & Data Entry/InlineEdit';

export interface StimulusCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image shown in the 80px thumbnail. Without one the thumbnail shows `icon` on a neutral fill. */
  thumbnail?: string;
  /** Alt text for `thumbnail`. Leave empty when the caption already describes the image. */
  thumbnailAlt?: string;
  /** Placeholder shown in the thumbnail when there is no `thumbnail` (e.g. a video camera for a video). Defaults to an image icon. */
  icon?: React.ReactNode;
  /**
   * `error` swaps the thumbnail for a broken-image icon on the destructive soft fill, for a stimulus that could not be
   * loaded. It is also applied automatically when `thumbnail` fails to load.
   */
  status?: 'default' | 'error';
  /** Small line above the caption saying who speaks it. */
  label?: React.ReactNode;
  /** What the AI moderator says when it shows the stimulus, e.g. "Look at this image". */
  caption?: string;
  /** Editor mode: makes the caption editable (click to edit, Enter or blur saves) and is called with the new text. */
  onCaptionChange?: (caption: string) => void;
  /** Editor mode: placeholder for an empty caption. */
  captionPlaceholder?: string;
  /** Shows the trash button. */
  onRemove?: () => void;
  /** Accessible name of the trash button. Defaults to "Remove stimulus". */
  removeLabel?: string;
}

// Figma: Stimulus card (605:3462) — a stimulus (image or video) with what the AI moderator says about it, and a remove button.
export const StimulusCard = React.forwardRef<HTMLDivElement, StimulusCardProps>(
  (
    {
      className,
      thumbnail,
      thumbnailAlt = '',
      icon,
      status = 'default',
      label = 'AI Moderator',
      caption,
      onCaptionChange,
      captionPlaceholder = 'Click to write what the AI moderator says',
      onRemove,
      removeLabel = 'Remove stimulus',
      ...props
    },
    ref,
  ) => {
    // Remember which source failed, so a new `thumbnail` gets a fresh chance to load.
    const [failedSrc, setFailedSrc] = React.useState<string | undefined>();
    const error = status === 'error' || (thumbnail !== undefined && failedSrc === thumbnail);
    const showImage = thumbnail !== undefined && !error;
    return (
      <div
        ref={ref}
        data-status={error ? 'error' : 'default'}
        className={cn('flex w-full items-center gap-4 rounded-md border border-border p-0.5 pr-4', className)}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span
            className={cn(
              'flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border',
              error
                ? 'border-destructive-soft-border bg-destructive-soft bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-destructive'
                : 'border-border bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground',
              showImage && 'bg-none',
            )}
          >
            {showImage ? (
              <img src={thumbnail} alt={thumbnailAlt} className="size-full object-cover" onError={() => setFailedSrc(thumbnail)} />
            ) : error ? (
              <ImageBroken size={24} aria-hidden />
            ) : (
              (icon ?? <ImageIcon size={24} aria-hidden />)
            )}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2 text-surface-foreground">
            <p className="w-full text-ui-label">{label}</p>
            {onCaptionChange ? (
              <InlineEdit
                variant="question"
                multiline
                // The editor pads its text (top 4px, bottom 5px plus a 1px border); pull that back so the card is as tall as its content.
                className="-mx-3 -mt-1 -mb-1.5 w-auto"
                aria-label="Stimulus caption"
                value={caption ?? ''}
                placeholder={captionPlaceholder}
                onValueChange={onCaptionChange}
                textClassName="text-body-base"
              />
            ) : (
              <p className="w-full text-body-base [word-break:break-word]">{caption}</p>
            )}
          </div>
        </div>
        {onRemove && (
          <Button type="button" variant="destructive" size="icon-sm" aria-label={removeLabel} onClick={onRemove}>
            <Trash size={16} aria-hidden />
          </Button>
        )}
      </div>
    );
  },
);
StimulusCard.displayName = 'StimulusCard';
