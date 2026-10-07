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
  /** Editor mode: caption length limit. Also what the counter counts against. */
  maxLength?: number;
  /** Editor mode: shows the "n/2000 characters" counter under the caption (it counts live while typing). Defaults to `true`; needs `maxLength`. */
  showCounter?: boolean;
  /** Shows the trash button. */
  onRemove?: () => void;
  /** Accessible name of the trash button. Defaults to "Remove stimulus". */
  removeLabel?: string;
}

const MIN_THUMBNAIL = 80;
const MAX_THUMBNAIL = 240;

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
      maxLength,
      showCounter = true,
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
    // Live character count while the caption is being edited (the saved value otherwise).
    const [draft, setDraft] = React.useState<string | null>(null);
    const count = (draft ?? caption ?? '').length;

    // The thumbnail is square and as tall as the text column (80-240px), so it grows when the caption wraps. That is circular in
    // plain CSS (its width narrows the text, which changes its height), so measure the text and size the thumbnail from it.
    const textRef = React.useRef<HTMLDivElement>(null);
    const [thumbnailSize, setThumbnailSize] = React.useState(MIN_THUMBNAIL);
    React.useEffect(() => {
      const el = textRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => {
        setThumbnailSize(Math.min(MAX_THUMBNAIL, Math.max(MIN_THUMBNAIL, Math.ceil(el.getBoundingClientRect().height))));
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return (
      <div
        ref={ref}
        data-status={error ? 'error' : 'default'}
        className={cn('flex min-h-21.5 w-full items-center gap-4 rounded-md border border-border p-0.5 pr-4', className)}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span
            style={{ width: thumbnailSize, height: thumbnailSize }}
            className={cn(
              'relative flex shrink-0 items-center justify-center overflow-hidden rounded-sm border',
              error
                ? 'border-destructive-soft-border bg-destructive-soft bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-destructive'
                : 'border-border bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground',
              showImage && 'bg-none',
            )}
          >
            {showImage ? (
              // Out of flow, so the image's own size never sets the thumbnail's size.
              <img src={thumbnail} alt={thumbnailAlt} className="absolute inset-0 size-full object-cover" onError={() => setFailedSrc(thumbnail)} />
            ) : error ? (
              <ImageBroken size={24} aria-hidden />
            ) : (
              (icon ?? <ImageIcon size={24} aria-hidden />)
            )}
          </span>
          <div ref={textRef} className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-2 text-surface-foreground">
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
                maxLength={maxLength}
                onValueChange={onCaptionChange}
                onDraftChange={setDraft}
                onEditingChange={(editing) => {
                  if (!editing) setDraft(null);
                }}
                textClassName="text-body-base"
              />
            ) : (
              <p className="w-full text-body-base [word-break:break-word]">{caption}</p>
            )}
            {onCaptionChange && showCounter && maxLength !== undefined && (
              <p className="text-ui-caption text-secondary-muted-foreground">
                {count}/{maxLength} characters
              </p>
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
