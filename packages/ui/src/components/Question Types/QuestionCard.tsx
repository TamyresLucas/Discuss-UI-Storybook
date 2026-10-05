import * as React from 'react';

import { cn } from '../../lib/utils';

// Figma: Question types (282:1491) — every question type sits on a 480px white card, 24px padding, 16px gap.
export const QuestionCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex w-120 max-w-200 flex-col gap-4 rounded-lg bg-surface p-6', className)}
      {...props}
    />
  ),
);
QuestionCard.displayName = 'QuestionCard';
