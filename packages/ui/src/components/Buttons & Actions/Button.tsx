import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const subtle =
  'bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5 text-surface-foreground hover:bg-accent-soft hover:bg-none hover:text-accent-soft-foreground disabled:bg-muted disabled:bg-none disabled:text-muted-foreground';

// Figma: Buttons (13) + Button Small/Reaction (16). Disabled is a flat 50%
// opacity for every type; the hover fill is `accent-soft` everywhere except
// primary (`primary-hover`) and destructive (a 10% black overlay).
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap text-ui-label transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-label hover:bg-primary-hover',
        subtle,
        // Alias of `subtle`, kept so existing consumers don't break.
        secondary: subtle,
        destructive: 'bg-destructive text-label hover:bg-destructive-hover',
        outline:
          'border border-border bg-surface text-surface-foreground hover:border-input-muted hover:bg-accent-soft hover:text-accent-soft-foreground disabled:bg-transparent disabled:border-input-muted disabled:text-muted-foreground',
        ghost:
          'text-surface-foreground hover:bg-accent-soft hover:text-accent-soft-foreground disabled:text-muted-foreground',
        link: 'text-surface-foreground underline hover:text-accent-foreground',
      },
      size: {
        md: 'h-10 min-w-10 gap-2.5 rounded-md px-4 py-2',
        sm: 'h-8 min-w-8 gap-1 rounded-sm px-2.5 py-1.5',
        lg: 'h-12 gap-2.5 rounded-md px-6 py-3 text-ui-label-large',
        icon: 'size-10 rounded-md p-0',
        'icon-sm': 'size-8 rounded-sm p-0',
      },
    },
    compoundVariants: [
      // Primary icon-only is a circle at 40px (and a rounded square at 32px).
      { variant: 'default', size: 'icon', className: 'rounded-full' },
      {
        variant: 'default',
        size: ['icon', 'icon-sm'],
        className: 'disabled:border disabled:border-border disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100',
      },
      // Destructive icon-only drops the fill and tints the glyph instead.
      {
        variant: 'destructive',
        size: ['icon', 'icon-sm'],
        className: 'bg-transparent text-destructive hover:bg-destructive-soft-hover',
      },
      { variant: 'outline', size: ['icon', 'icon-sm'], className: 'disabled:border-border' },
      // Links have no box of their own.
      { variant: 'link', className: 'rounded-md bg-transparent px-4' },
    ],
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
