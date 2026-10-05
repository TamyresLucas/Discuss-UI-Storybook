import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { TabItem } from '../Navigation/TabItem';
import { TabNavigation, Tabs } from '../Navigation/TabNavigation';

export interface TimeValue {
  /** 1–12 */
  hour: number;
  /** 0–59 */
  minute: number;
  period: 'AM' | 'PM';
}

export interface TimeItemProps extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  /** Dashed outline to suggest this slot. */
  recommended?: boolean;
}

// Figma: Calendar (25) › Time Item — a 12px/16px chip; selected is the subtle fill, hover is accent-soft.
export const TimeItem = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Item>, TimeItemProps>(
  ({ className, recommended, ...props }, ref) => (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'flex w-full justify-center rounded-sm px-2.5 py-1.5 text-ui-caption text-secondary-muted-foreground transition-colors',
        'hover:bg-accent-soft hover:text-accent-soft-foreground',
        'data-[state=on]:bg-secondary data-[state=on]:bg-linear-to-r data-[state=on]:from-overlay-dark-5 data-[state=on]:to-overlay-dark-5 data-[state=on]:text-surface-foreground',
        'data-[state=on]:hover:bg-accent-soft data-[state=on]:hover:bg-none data-[state=on]:hover:text-accent-soft-foreground',
        'disabled:pointer-events-none disabled:opacity-60 disabled:text-muted-foreground',
        recommended && 'border border-dashed border-border text-surface-foreground',
        className,
      )}
      {...props}
    />
  ),
);
TimeItem.displayName = 'TimeItem';

export interface TimePickerProps {
  value?: TimeValue;
  onValueChange?: (value: TimeValue) => void;
  /** Minute interval between options. */
  minuteStep?: number;
  isHourDisabled?: (hour: number, period: 'AM' | 'PM') => boolean;
  isMinuteDisabled?: (minute: number, hour: number, period: 'AM' | 'PM') => boolean;
  isHourRecommended?: (hour: number, period: 'AM' | 'PM') => boolean;
  isMinuteRecommended?: (minute: number, hour: number, period: 'AM' | 'PM') => boolean;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Figma: Calendar (25) › Time Picker Panel — AM/PM switch with hour and minute columns. */
export function TimePicker({
  value,
  onValueChange,
  minuteStep = 5,
  isHourDisabled,
  isMinuteDisabled,
  isHourRecommended,
  isMinuteRecommended,
  className,
}: TimePickerProps) {
  const current: TimeValue = value ?? { hour: 12, minute: 0, period: 'AM' };
  const root = React.useRef<HTMLDivElement>(null);
  // Bring the selected hour / minute into view when the (scrollable) columns mount.
  React.useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>('[data-state="on"]').forEach((item) => {
      const column = item.parentElement;
      if (column) column.scrollTop = Math.max(0, item.offsetTop - column.offsetTop - column.clientHeight / 2 + item.clientHeight / 2);
    });
  }, []);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  return (
    <div ref={root} className={cn('flex w-45 flex-col gap-4 pt-2', className)}>
      <p className="text-ui-label text-surface-foreground">Select Time</p>
      <Tabs
        value={current.period}
        onValueChange={(period) => onValueChange?.({ ...current, period: period as 'AM' | 'PM' })}
      >
        <TabNavigation variant="toggle" aria-label="AM or PM" className="self-start">
          {(['AM', 'PM'] as const).map((period) => (
            <TabItem key={period} value={period}>
              {period}
            </TabItem>
          ))}
        </TabNavigation>
      </Tabs>
      <div className="flex h-47.5 w-full items-start gap-3">
        <ToggleGroupPrimitive.Root
          type="single"
          aria-label="Hour"
          value={String(current.hour)}
          onValueChange={(next) => next && onValueChange?.({ ...current, hour: Number(next) })}
          className="flex h-full min-w-0 flex-1 flex-col gap-1 overflow-y-auto"
        >
          {hours.map((hour) => (
            <TimeItem
              key={hour}
              value={String(hour)}
              disabled={isHourDisabled?.(hour, current.period)}
              recommended={isHourRecommended?.(hour, current.period)}
            >
              {pad(hour)}
            </TimeItem>
          ))}
        </ToggleGroupPrimitive.Root>
        <div className="flex h-full items-center text-ui-label-large text-surface-foreground" aria-hidden="true">
          :
        </div>
        <ToggleGroupPrimitive.Root
          type="single"
          aria-label="Minute"
          value={String(current.minute)}
          onValueChange={(next) => next && onValueChange?.({ ...current, minute: Number(next) })}
          className="flex h-full min-w-0 flex-1 flex-col gap-1 overflow-y-auto"
        >
          {minutes.map((minute) => (
            <TimeItem
              key={minute}
              value={String(minute)}
              disabled={isMinuteDisabled?.(minute, current.hour, current.period)}
              recommended={isMinuteRecommended?.(minute, current.hour, current.period)}
            >
              {pad(minute)}
            </TimeItem>
          ))}
        </ToggleGroupPrimitive.Root>
      </div>
    </div>
  );
}
