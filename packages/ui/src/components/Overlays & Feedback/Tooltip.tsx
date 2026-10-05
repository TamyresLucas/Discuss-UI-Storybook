import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'title'> {
  /** Bold first line. With `description` this is the Descriptive tooltip. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Underlined action line under the description — the Rich tooltip. Usually a link or button. */
  action?: React.ReactNode;
  /** Show the pointer arrow toward the trigger. */
  arrow?: boolean;
}

// Figma: Tooltip (51) — `primary-soft-foreground` plum card, 6px radius. Simple = one line of label text;
// Descriptive = title + description; Rich = adds an action link.
export const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  ({ className, sideOffset = 4, title, description, action, arrow = true, children, ...props }, ref) => {
    const detailed = title != null || description != null;
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          style={{ zIndex: 'var(--sys-z-40)' }}
          className={cn(
            'rounded-sm bg-primary-soft-foreground text-label shadow-md',
            detailed ? 'flex max-w-60 min-w-50 flex-col gap-1 px-3 py-2.5' : 'px-2.5 py-1.5 text-ui-caption',
            action != null && 'max-w-65 min-w-55',
            className,
          )}
          {...props}
        >
          {detailed ? (
            <>
              {title != null && <p className="text-xs leading-4 font-semibold text-label">{title}</p>}
              {description != null && <p className="text-xs leading-4.5 text-plum-200">{description}</p>}
              {action != null && (
                <div className="mt-1 text-ui-caption text-plum-300 underline *:underline">{action}</div>
              )}
            </>
          ) : (
            children
          )}
          {arrow && <TooltipPrimitive.Arrow width={12} height={8} className="fill-primary-soft-foreground" />}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
TooltipContent.displayName = 'TooltipContent';
