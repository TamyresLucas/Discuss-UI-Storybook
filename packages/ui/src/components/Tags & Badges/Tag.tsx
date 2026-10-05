import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

// Figma: System Tag + Status Tag (41). Border + 6px radius, 12px/16px medium label.
const tagVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2.5 py-1 text-ui-caption',
  {
    variants: {
      variant: {
        neutral: 'border-accent-soft-border bg-accent-soft text-accent-soft-foreground',
        default: 'border-border bg-surface text-surface-foreground',
        success: 'border-success-soft-border bg-success-soft text-success-soft-foreground',
        warning: 'border-warning-soft-border bg-warning-soft text-warning-soft-foreground',
        destructive: 'border-destructive-soft-border bg-destructive-soft text-destructive-soft-foreground',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {}

/** Read-only label for system states (Live Interview, Self-paced, AI Interview). */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(tagVariants({ variant }), className)} {...props} />
));
Tag.displayName = 'Tag';

const statusDotVariants = cva('size-1.5 shrink-0 rounded-full', {
  variants: {
    status: {
      active: 'bg-success-800',
      inactive: 'bg-accent',
      pending: 'bg-warning',
      error: 'bg-destructive',
    },
  },
  defaultVariants: { status: 'active' },
});

export interface StatusTagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Required<Pick<VariantProps<typeof statusDotVariants>, 'status'>> {}

/** White tag with a coloured status dot (Active / Inactive / Pending / Error). */
export const StatusTag = React.forwardRef<HTMLSpanElement, StatusTagProps>(
  ({ className, status, children, ...props }, ref) => (
    <span ref={ref} className={cn(tagVariants({ variant: 'default' }), className)} {...props}>
      <span className={statusDotVariants({ status })} aria-hidden="true" />
      {children}
    </span>
  ),
);
StatusTag.displayName = 'StatusTag';
