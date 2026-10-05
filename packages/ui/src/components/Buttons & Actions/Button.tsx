import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-label hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-accent-soft hover:text-accent-soft-foreground',
        destructive: 'bg-destructive text-label hover:bg-destructive-hover',
        outline:
          'border border-border bg-background text-foreground hover:border-input hover:bg-accent-soft hover:text-accent-soft-foreground',
        ghost: 'text-foreground hover:bg-accent-soft hover:text-accent-soft-foreground',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render `props.children` into the child element instead of wrapping it in
   * a `<button>` (Radix `Slot`) — lets consumers compose e.g.
   * `<Button asChild><a href="...">Label</a></Button>` without double-wrapping.
   * The ref then targets whatever element the child renders, not necessarily
   * an `HTMLButtonElement`.
   */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';
