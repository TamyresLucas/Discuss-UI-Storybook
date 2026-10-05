import * as React from 'react';
import { FileText, X } from '@phosphor-icons/react';
import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Tag } from '../Tags & Badges/Tag';

export interface FileUploadZoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'title' | 'type'> {
  title?: React.ReactNode;
  /** Supported formats line. */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  /** Called with the chosen or dropped files. */
  onFiles?: (files: File[]) => void;
}

// Figma: Question types › PDF, PPTX, or DOCX › Upload_Zone — a dashed drop target with an icon, title and hint.
export const FileUploadZone = React.forwardRef<HTMLInputElement, FileUploadZoneProps>(
  ({ className, title = 'Upload document', hint, icon, onFiles, ...props }, ref) => {
    const [over, setOver] = React.useState(false);
    return (
      <label
        className={cn(
          'flex w-full cursor-pointer flex-col items-center gap-4 rounded-md border-2 border-dashed border-border px-6 py-8 text-center transition-colors',
          'hover:border-input has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
          over && 'border-input-accent bg-accent-soft',
          className,
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          onFiles?.(Array.from(event.dataTransfer.files));
        }}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground">
          {icon ?? <FileText size={24} aria-hidden />}
        </span>
        <span className="flex flex-col gap-2">
          <span className="text-body-small text-surface-foreground">{title}</span>
          {hint && <span className="text-ui-caption text-secondary-muted-foreground">{hint}</span>}
        </span>
        <input
          ref={ref}
          type="file"
          className="sr-only"
          onChange={(event) => onFiles?.(Array.from(event.target.files ?? []))}
          {...props}
        />
      </label>
    );
  },
);
FileUploadZone.displayName = 'FileUploadZone';

export interface FileUploadItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** File size text, e.g. "443KB". */
  size?: string;
  status?: 'uploading' | 'complete' | 'error';
  /** 0–100, shown while uploading. */
  progress?: number;
  /** Remaining time text while uploading, e.g. "2 seconds left". */
  timeLeft?: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}

// Figma: File upload (339:2168) — a row with the file, its status and, while uploading, a thin progress bar.
export const FileUploadItem = React.forwardRef<HTMLDivElement, FileUploadItemProps>(
  ({ className, name, size, status = 'uploading', progress = 0, timeLeft, icon, onRemove, removeLabel, ...props }, ref) => {
    const uploading = status === 'uploading';
    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col justify-center gap-2 overflow-hidden rounded-sm border border-border p-2', className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground">
            {icon ?? <FileText size={24} aria-hidden />}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-ui-label text-surface-foreground">{name}</p>
                {status === 'complete' && <Tag variant="success">Complete</Tag>}
                {status === 'error' && <Tag variant="destructive">Error</Tag>}
              </div>
              {onRemove && (
                <Button type="button" variant="ghost" size="icon-sm" aria-label={removeLabel ?? `Remove ${name}`} onClick={onRemove}>
                  <X size={16} aria-hidden />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between text-ui-caption text-secondary-muted-foreground">
              <span className="flex items-center gap-2">
                {size}
                {uploading && timeLeft && (
                  <>
                    <span aria-hidden="true" className="size-0.5 rounded-full bg-secondary-muted-foreground" />
                    {timeLeft}
                  </>
                )}
              </span>
              {uploading && <span className="text-body-xxs font-normal">{Math.round(progress)}%</span>}
            </div>
          </div>
        </div>
        {uploading && (
          <ProgressPrimitive.Root
            value={progress}
            aria-label={`Uploading ${name}`}
            className="h-0.75 w-full overflow-hidden rounded-sm bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5"
          >
            <ProgressPrimitive.Indicator className="h-full bg-accent transition-[width]" style={{ width: `${progress}%` }} />
          </ProgressPrimitive.Root>
        )}
      </div>
    );
  },
);
FileUploadItem.displayName = 'FileUploadItem';
