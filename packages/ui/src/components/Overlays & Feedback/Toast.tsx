import * as React from 'react';
import { CheckCircle, Info, Warning, WarningCircle, X } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Toast as ToastPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';

export type ToastVariant = 'info' | 'success' | 'warning' | 'destructive';

const toastVariants = cva('border', {
  variants: {
    variant: {
      info: 'border-info-border bg-surface',
      success: 'border-success-soft-border bg-success-soft',
      warning: 'border-warning-soft-border bg-warning-soft',
      destructive: 'border-destructive-soft-border bg-destructive-soft',
    },
  },
  defaultVariants: { variant: 'info' },
});

// The in-page banner also has a quiet look (Figma: Persistent Message › info), used for suggestions rather than status.
const inlineVariants = cva('border', {
  variants: {
    variant: {
      neutral: 'border-border bg-secondary',
      info: 'border-info-border bg-surface',
      success: 'border-success-soft-border bg-success-soft',
      warning: 'border-warning-soft-border bg-warning-soft',
      destructive: 'border-destructive-soft-border bg-destructive-soft',
    },
  },
  defaultVariants: { variant: 'info' },
});

export type ToastInlineVariant = ToastVariant | 'neutral';

const iconColour: Record<ToastVariant, string> = {
  info: 'text-surface-foreground',
  success: 'text-success-soft-foreground',
  warning: 'text-warning-soft-foreground',
  destructive: 'text-destructive-soft-foreground',
};

const titleColour: Record<ToastVariant, string> = {
  info: 'text-surface-foreground',
  success: 'text-success-soft-foreground',
  warning: 'text-warning-soft-foreground',
  destructive: 'text-destructive-soft-foreground',
};

function VariantIcon({ variant, size }: { variant: ToastVariant; size: number }) {
  const props = { size, 'aria-hidden': true, className: cn('shrink-0', iconColour[variant]) } as const;
  if (variant === 'success') return <CheckCircle {...props} />;
  if (variant === 'warning') return <Warning {...props} />;
  if (variant === 'destructive') return <WarningCircle {...props} />;
  return <Info {...props} />;
}

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    style={{ zIndex: 'var(--sys-z-50)' }}
    className={cn('fixed right-4 bottom-4 flex w-89 max-w-full flex-col gap-3 outline-none', className)}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

export interface ToastProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, 'title'>,
    VariantProps<typeof toastVariants> {
  /** Bold first line. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Optional action button (e.g. Undo). Wrap it in `ToastAction`. */
  action?: React.ReactNode;
  closeLabel?: string;
}

// Figma: Toast / Sonner (52) › Toast — 356px card with a 20px status icon, title, description and close.
export const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = 'info', title, description, action, closeLabel = 'Close', children, ...props }, ref) => {
    const v = variant ?? 'info';
    return (
      <ToastPrimitive.Root
        ref={ref}
        // Errors interrupt; everything else is polite.
        type={v === 'destructive' ? 'foreground' : 'background'}
        className={cn('flex items-start gap-3 rounded-lg p-4 shadow-lg', toastVariants({ variant: v }), className)}
        {...props}
      >
        <VariantIcon variant={v} size={20} />
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-body-small">
          {title != null && (
            <ToastPrimitive.Title className={cn('font-semibold', titleColour[v])}>{title}</ToastPrimitive.Title>
          )}
          {description != null && (
            <ToastPrimitive.Description className="text-secondary-muted-foreground">{description}</ToastPrimitive.Description>
          )}
          {children}
          {action}
        </div>
        <ToastPrimitive.Close
          aria-label={closeLabel}
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-xs text-surface-foreground"
        >
          <X size={16} aria-hidden />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  },
);
Toast.displayName = 'Toast';

export const ToastAction = ToastPrimitive.Action;

export interface ToastInlineProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof inlineVariants> {
  /** Buttons shown after the message, for example a ghost "Dismiss" and an outline "Fix" (both `size="sm"`). */
  actions?: React.ReactNode;
  /** Show a close button and call this when it is pressed. */
  onClose?: () => void;
  closeLabel?: string;
}

// Figma: Toast Inline / Persistent Message — a single-line banner (46px) for in-page messages, with optional actions.
export const ToastInline = React.forwardRef<HTMLDivElement, ToastInlineProps>(
  ({ className, variant = 'info', actions, onClose, closeLabel = 'Close', children, ...props }, ref) => {
    const v = variant ?? 'info';
    return (
      <div
        ref={ref}
        role={v === 'destructive' ? 'alert' : 'status'}
        className={cn('flex items-center gap-2 rounded-sm px-2 py-1.5', inlineVariants({ variant: v }), className)}
        {...props}
      >
        <VariantIcon variant={v === 'neutral' ? 'info' : v} size={16} />
        <p className="min-w-0 flex-1 text-body-small text-secondary-muted-foreground">{children}</p>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        {onClose && (
          <Button type="button" variant="ghost" size="icon-sm" aria-label={closeLabel} onClick={onClose}>
            <X size={16} aria-hidden />
          </Button>
        )}
      </div>
    );
  },
);
ToastInline.displayName = 'ToastInline';
