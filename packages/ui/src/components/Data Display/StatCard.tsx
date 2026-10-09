import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const statCardVariants = cva('flex min-w-0 flex-col gap-2 rounded-md border p-3', {
  variants: {
    variant: {
      default: 'border-border bg-transparent',
      // A card tinted with the secondary background and no border, for stats on a white panel.
      subtle: 'border-transparent bg-secondary',
      warning: 'border-warning-soft-border bg-warning-soft',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof statCardVariants> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Leading icon beside the value (24px). */
  icon?: React.ReactNode;
}

// Figma: Activity control (361:5214) › stat-card — a small bordered label/value tile; `warning` tints it yellow.
export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant, label, value, icon, ...props }, ref) => (
    <div ref={ref} className={cn(statCardVariants({ variant }), className)} {...props}>
      <p className="truncate text-ui-caption text-secondary-muted-foreground">{label}</p>
      <p className="flex items-center gap-2 text-body-base text-surface-foreground">
        {icon && (
          <span aria-hidden="true" className="inline-flex size-6 shrink-0 items-center justify-center">
            {icon}
          </span>
        )}
        {value}
      </p>
    </div>
  ),
);
StatCard.displayName = 'StatCard';
