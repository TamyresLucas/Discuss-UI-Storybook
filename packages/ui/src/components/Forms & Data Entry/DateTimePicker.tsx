import * as React from 'react';
import { CalendarBlank } from '@phosphor-icons/react';
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { Calendar, type CalendarProps } from './Calendar';
import { Field } from './Field';
import { formatDateTime } from './formatDateTime';
import { TimePicker, type TimePickerProps, type TimeValue } from './TimePicker';

function toTimeValue(date: Date | undefined): TimeValue | undefined {
  if (!date) return undefined;
  const hours = date.getHours();
  return { hour: hours % 12 === 0 ? 12 : hours % 12, minute: date.getMinutes(), period: hours >= 12 ? 'PM' : 'AM' };
}

function combine(date: Date, time: TimeValue): Date {
  const next = new Date(date);
  next.setHours((time.hour % 12) + (time.period === 'PM' ? 12 : 0), time.minute, 0, 0);
  return next;
}

export interface DateTimePickerProps {
  /** Initial selection. The picker keeps its own draft until Apply, so remount it (e.g. with a `key`) to reset from a new value. */
  value?: Date;
  defaultValue?: Date;
  /** Called with the chosen date (time included when `showTime`) when Apply is pressed. */
  onApply?: (value: Date | undefined) => void;
  onReset?: () => void;
  /** Show the time picker column next to the calendar. */
  showTime?: boolean;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  timePickerProps?: Omit<TimePickerProps, 'value' | 'onValueChange'>;
  className?: string;
}

// Figma: Calendar (25) › Date & time picker — card with the calendar, an optional time column and Reset / Apply.
export function DateTimePicker({
  value,
  defaultValue,
  onApply,
  onReset,
  showTime = true,
  calendarProps,
  timePickerProps,
  className,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value ?? defaultValue);
  const [time, setTime] = React.useState<TimeValue | undefined>(toTimeValue(value ?? defaultValue));

  const apply = () => {
    if (!date) return onApply?.(undefined);
    onApply?.(showTime ? combine(date, time ?? { hour: 12, minute: 0, period: 'AM' }) : date);
  };

  return (
    <div
      className={cn(
        'inline-flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-md',
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} {...calendarProps} />
        {showTime && (
          <>
            <div className="h-70 w-px self-center bg-border" aria-hidden="true" />
            <TimePicker value={time} onValueChange={setTime} {...timePickerProps} />
          </>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setDate(undefined);
            setTime(undefined);
            onReset?.();
          }}
        >
          Reset
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={apply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

export interface DatePickerProps extends Omit<DateTimePickerProps, 'onApply' | 'className'> {
  label?: React.ReactNode;
  placeholder?: string;
  onValueChange?: (value: Date | undefined) => void;
  className?: string;
}

/** Field-style trigger that opens a `DateTimePicker` in a popover. Figma: Calendar (25) › Calendar & time. */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ label, placeholder = 'Select date and time', value, defaultValue, onValueChange, showTime = true, className, ...pickerProps }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);
    const current = value ?? internal;

    return (
      <Field label={label} className={cn('w-75', className)}>
        {(control) => (
          <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
            <PopoverPrimitive.Trigger asChild>
              <button
                ref={ref}
                type="button"
                {...control}
                className="flex h-10 w-full items-center gap-3 rounded-md border border-input bg-surface px-3 py-2.5 text-left shadow-xs transition-colors hover:border-input-accent data-[state=open]:border-input-accent"
              >
                <CalendarBlank size={24} aria-hidden className="shrink-0 text-surface-foreground" />
                <span className={cn('truncate', current ? 'text-ui-label-large text-surface-foreground' : 'text-body-base text-muted-foreground')}>
                  {current ? formatDateTime(current, showTime) : placeholder}
                </span>
              </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content align="start" sideOffset={8} style={{ zIndex: 'var(--sys-z-20)' }}>
                <DateTimePicker
                  {...pickerProps}
                  showTime={showTime}
                  value={current}
                  onApply={(next) => {
                    setInternal(next);
                    onValueChange?.(next);
                    setOpen(false);
                  }}
                />
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
        )}
      </Field>
    );
  },
);
DatePicker.displayName = 'DatePicker';
