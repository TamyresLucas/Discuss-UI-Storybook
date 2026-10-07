import * as React from 'react';
import { CornersOut, DotsThree, Image as ImageIcon, Pause, Play, SpeakerSimpleHigh, SpeakerSimpleX, Trash } from '@phosphor-icons/react';
import { Slider as SliderPrimitive, ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';

export interface MediaInfoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  name: string;
  /** Secondary line parts, e.g. ["443KB", "1/5"], joined with a dot. */
  details?: string[];
  onRemove?: () => void;
  removeLabel?: string;
  /** Larger name / details (the image preview uses these). */
  large?: boolean;
}

// Figma: File upload › video-info-section / image preview — file name + details with a trash button.
export function MediaInfo({ name, details, onRemove, removeLabel, large, className, ...props }: MediaInfoProps) {
  return (
    <div className={cn('flex items-center justify-between border-t border-border bg-surface px-6 py-4', className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className={cn('truncate text-surface-foreground', large ? 'text-body-section' : 'text-ui-label')}>{name}</p>
        {details && (
          <p className={cn('flex items-center gap-2 text-secondary-muted-foreground', large ? 'text-body-small' : 'text-ui-caption')}>
            {details.map((part, index) => (
              <React.Fragment key={part}>
                {index > 0 && <span aria-hidden="true" className="size-0.5 rounded-full bg-secondary-muted-foreground" />}
                {part}
              </React.Fragment>
            ))}
          </p>
        )}
      </div>
      {onRemove && (
        <Button type="button" variant="destructive" size="icon" aria-label={removeLabel ?? `Remove ${name}`} onClick={onRemove}>
          <Trash size={16} aria-hidden />
        </Button>
      )}
    </div>
  );
}

export interface ImagePreviewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The image (an `<img>`). The preview area is as tall as the image at full width, up to 336px. Leave empty for the fixed-height placeholder fill. */
  children?: React.ReactNode;
  name: string;
  details?: string[];
  onRemove?: () => void;
}

// Figma: File upload › Image preview — a 12px-radius card: preview area over a name / size / count bar.
export const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(
  ({ className, children, name, details, onRemove, ...props }, ref) => (
    <div ref={ref} className={cn('flex w-full flex-col overflow-hidden rounded-lg border border-border', className)} {...props}>
      <div
        className={cn(
          'flex w-full items-center justify-center bg-accent-soft',
          // With an image the area hugs it (full width, its own height, at most 336px tall); the empty placeholder keeps the fixed height.
          children ? '[&>img]:block [&>img]:h-auto [&>img]:max-h-84 [&>img]:w-full [&>img]:object-contain' : 'h-84',
        )}
      >
        {children}
      </div>
      <MediaInfo name={name} details={details} onRemove={onRemove} large />
    </div>
  ),
);
ImagePreview.displayName = 'ImagePreview';

export interface ImageThumbnailsProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, 'type' | 'value' | 'defaultValue' | 'onValueChange'> {
  /** Slots shown, e.g. 5. Slots past `images.length` render as empty dashed placeholders. */
  max: number;
  images: { id: string; src?: string; alt: string }[];
  value?: string;
  onValueChange?: (id: string) => void;
}

// Figma: File upload › Image thumbnail — selected (accent-soft + accent border), default, and dashed empty slots.
export const ImageThumbnails = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ImageThumbnailsProps>(
  ({ className, max, images, value, onValueChange, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type="single"
      value={value ?? ''}
      onValueChange={(next) => next && onValueChange?.(next)}
      className={cn('flex w-full gap-2', className)}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const image = images[index];
        if (!image) {
          return (
            <span
              key={`empty-${index}`}
              aria-hidden="true"
              className="flex h-20 min-w-0 flex-1 items-center justify-center rounded-sm border border-dashed border-border text-accent-foreground"
            >
              <ImageIcon size={24} />
            </span>
          );
        }
        return (
          <ToggleGroupPrimitive.Item
            key={image.id}
            value={image.id}
            aria-label={image.alt}
            className={cn(
              'flex h-20 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-sm border border-border bg-background bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 p-2 text-surface-foreground transition-colors',
              'hover:bg-accent-soft hover:bg-none',
              'data-[state=on]:border-accent-foreground data-[state=on]:bg-accent-soft data-[state=on]:bg-none data-[state=on]:text-accent-foreground',
            )}
          >
            {image.src ? <img src={image.src} alt="" className="size-full object-cover" /> : <ImageIcon size={24} aria-hidden />}
          </ToggleGroupPrimitive.Item>
        );
      })}
    </ToggleGroupPrimitive.Root>
  ),
);
ImageThumbnails.displayName = 'ImageThumbnails';

const formatTime = (seconds: number) => {
  const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

export interface VideoPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Video source. Without one, the area shows the placeholder fill. */
  src?: string;
  name?: string;
  details?: string[];
  onRemove?: () => void;
  /** Called by the "more" (…) button. */
  onMore?: () => void;
  /** Initial time values for static previews (seconds). */
  initialTime?: number;
  initialDuration?: number;
}

// Figma: File upload › Video player — preview area with a dark control bar (play, seek, time, volume, full screen), then file info.
export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  ({ className, src, name, details, onRemove, onMore, initialTime = 0, initialDuration = 0, ...props }, ref) => {
    const video = React.useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = React.useState(false);
    const [time, setTime] = React.useState(initialTime);
    const [duration, setDuration] = React.useState(initialDuration);
    const [volume, setVolume] = React.useState(1);
    const muted = volume === 0;

    const toggle = () => {
      const el = video.current;
      if (!el) return setPlaying((p) => !p);
      if (el.paused) void el.play();
      else el.pause();
    };

    return (
      <div ref={ref} className={cn('flex w-full flex-col overflow-hidden rounded-lg border border-border bg-surface', className)} {...props}>
        <div className="relative flex h-60.5 w-full items-end bg-accent-soft">
          {src && (
            <video
              ref={video}
              src={src}
              className="absolute inset-0 size-full object-contain"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onVolumeChange={(event) => setVolume(event.currentTarget.muted ? 0 : event.currentTarget.volume)}
            />
          )}
          <div className="relative flex w-full flex-col gap-2 bg-surface-foreground bg-linear-to-r from-primary/30 to-primary/30 px-4 pt-3 pb-4 text-surface">
            <SliderPrimitive.Root
              min={0}
              max={duration || 1}
              step={0.1}
              value={[Math.min(time, duration || 1)]}
              onValueChange={([next]) => {
                if (next === undefined) return;
                setTime(next);
                if (video.current) video.current.currentTime = next;
              }}
              className="relative flex h-4 w-full touch-none items-center select-none"
            >
              <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-xxs bg-surface/20">
                <SliderPrimitive.Range className="absolute h-full bg-accent-foreground" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb aria-label="Seek" className="block size-3 rounded-full border-2 border-surface bg-surface shadow-sm" />
            </SliderPrimitive.Root>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label={playing ? 'Pause' : 'Play'}
                  onClick={toggle}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-surface/12 text-surface transition-colors hover:bg-surface/20"
                >
                  {playing ? <Pause size={16} weight="fill" aria-hidden /> : <Play size={16} weight="fill" aria-hidden />}
                </button>
                <span className="text-ui-label whitespace-nowrap text-surface/80">
                  {formatTime(time)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeControl
                  volume={volume}
                  onVolumeChange={(next) => {
                    setVolume(next);
                    if (video.current) {
                      video.current.volume = next;
                      video.current.muted = next === 0;
                    }
                  }}
                />
                <button
                  type="button"
                  aria-label="Full screen"
                  onClick={() => void video.current?.requestFullscreen?.()}
                  className="inline-flex size-10 items-center justify-center rounded-md text-surface transition-colors hover:bg-surface/12"
                >
                  <CornersOut size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="More"
                  onClick={onMore}
                  className="inline-flex size-10 items-center justify-center rounded-md text-surface transition-colors hover:bg-surface/12"
                >
                  <DotsThree size={16} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
        {name && <MediaInfo name={name} details={details} onRemove={onRemove} />}
        <span className="sr-only" aria-live="polite">
          {muted ? 'Muted' : ''}
        </span>
      </div>
    );
  },
);
VideoPlayer.displayName = 'VideoPlayer';

export interface VolumeControlProps {
  /** 0–1. */
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

// Figma: Volume control — a speaker button that reveals a slider on hover or focus.
export function VolumeControl({ volume, onVolumeChange, className }: VolumeControlProps) {
  const last = React.useRef(volume || 1);
  if (volume > 0) last.current = volume;
  return (
    <div className={cn('group/volume flex items-center', className)}>
      <div className="w-0 overflow-hidden opacity-0 transition-all group-focus-within/volume:w-16 group-focus-within/volume:opacity-100 group-hover/volume:w-16 group-hover/volume:opacity-100">
        <SliderPrimitive.Root
          min={0}
          max={1}
          step={0.05}
          value={[volume]}
          onValueChange={([next]) => next !== undefined && onVolumeChange(next)}
          className="relative flex h-4 w-14 touch-none items-center select-none"
        >
          <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-xxs bg-surface/20">
            <SliderPrimitive.Range className="absolute h-full bg-surface" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb aria-label="Volume" className="block size-3 rounded-full bg-surface shadow-sm" />
        </SliderPrimitive.Root>
      </div>
      <button
        type="button"
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        onClick={() => onVolumeChange(volume === 0 ? last.current : 0)}
        className="inline-flex size-10 items-center justify-center rounded-md text-surface transition-colors hover:bg-surface/12"
      >
        {volume === 0 ? <SpeakerSimpleX size={16} aria-hidden /> : <SpeakerSimpleHigh size={16} aria-hidden />}
      </button>
    </div>
  );
}
