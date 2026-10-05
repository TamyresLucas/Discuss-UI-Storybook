import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

import { cn } from '../../lib/utils';

export type CalendarProps = DayPickerProps & {
  /** Days to mark with a dashed outline (e.g. suggested interview slots). */
  recommendedDates?: Date[];
};

const subtleFill = 'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5';

// Figma: Calendar (25) › Calendar / DayCell-24 — 36px round day cells on a 4px grid, month + year pickers in the header.
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'dropdown',
  recommendedDates,
  modifiers,
  modifiersClassNames,
  startMonth,
  endMonth,
  ...props
}: CalendarProps) {
  const year = new Date().getFullYear();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={startMonth ?? new Date(year - 10, 0)}
      endMonth={endMonth ?? new Date(year + 10, 11)}
      className={cn('w-71 text-surface-foreground', className)}
      modifiers={{ ...(recommendedDates ? { recommended: recommendedDates } : {}), ...modifiers }}
      modifiersClassNames={{
        recommended: 'border border-dashed border-border *:text-surface-foreground',
        ...modifiersClassNames,
      }}
      classNames={{
        root: 'relative',
        months: 'flex flex-col',
        month: 'flex flex-col items-center gap-4',
        nav: 'absolute inset-x-0 top-0 flex h-8 items-center justify-between',
        button_previous:
          'inline-flex size-8 items-center justify-center rounded-sm text-surface-foreground hover:bg-accent-soft hover:text-accent-soft-foreground disabled:opacity-50',
        button_next:
          'inline-flex size-8 items-center justify-center rounded-sm text-surface-foreground hover:bg-accent-soft hover:text-accent-soft-foreground disabled:opacity-50',
        month_caption: 'flex h-8 items-center justify-center',
        dropdowns: 'flex items-center gap-1',
        dropdown_root:
          'relative inline-flex items-center rounded-md border border-input bg-surface px-3 py-1.5 text-body-small shadow-xs hover:border-input-accent',
        dropdown: 'absolute inset-0 cursor-pointer opacity-0',
        caption_label: 'flex items-center gap-2 text-body-small text-surface-foreground',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex gap-1',
        weekday: 'flex h-8 w-9 items-center justify-center text-ui-caption text-muted-foreground',
        weeks: 'flex flex-col gap-1',
        week: 'flex gap-1',
        day: 'size-9 rounded-full p-0 text-center',
        day_button:
          'flex size-full items-center justify-center rounded-full text-ui-caption text-secondary-muted-foreground transition-colors hover:bg-accent-soft hover:text-accent-soft-foreground',
        selected: cn(subtleFill, '*:text-surface-foreground'),
        today: 'font-semibold',
        outside: 'opacity-60 *:text-muted-foreground',
        disabled: 'opacity-60 *:pointer-events-none *:text-muted-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <CaretLeft size={16} aria-hidden />
          ) : orientation === 'right' ? (
            <CaretRight size={16} aria-hidden />
          ) : (
            <CaretDown size={16} aria-hidden />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';
