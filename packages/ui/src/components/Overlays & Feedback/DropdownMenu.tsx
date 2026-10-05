import * as React from 'react';
import { CaretRight, Check, Trash } from '@phosphor-icons/react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// Figma: Dropdown Menu (50) — white card, 1px border, 8px radius, 4px padding and 2px between items.
const contentClasses =
  'min-w-80 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md';

export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>;

/**
 * Radix moves DOM focus to the hovered item, so `:focus-visible` can't tell hover
 * from keyboard navigation. Track the last input modality instead: hover only
 * fills the item, and the ring is drawn only after a key press.
 */
function useKeyboardModality<T extends HTMLElement>(
  onKeyDown?: React.KeyboardEventHandler<T>,
  onPointerMove?: React.PointerEventHandler<T>,
) {
  const [keyboard, setKeyboard] = React.useState(false);
  return {
    'data-keyboard': keyboard ? '' : undefined,
    onKeyDown: (event: React.KeyboardEvent<T>) => {
      setKeyboard(true);
      onKeyDown?.(event);
    },
    onPointerMove: (event: React.PointerEvent<T>) => {
      setKeyboard(false);
      onPointerMove?.(event);
    },
  };
}

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, onKeyDown, onPointerMove, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      style={{ zIndex: 'var(--sys-z-30)' }}
      className={cn(contentClasses, 'group/menu flex flex-col gap-0.5', className)}
      {...useKeyboardModality(onKeyDown, onPointerMove)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

const itemBase =
  'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-body-base text-surface-foreground outline-none select-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50';
const itemHover =
  'data-[highlighted]:bg-accent-soft group-data-[keyboard]/menu:data-[highlighted]:outline-solid group-data-[keyboard]/menu:data-[highlighted]:outline-2 group-data-[keyboard]/menu:data-[highlighted]:-outline-offset-2 group-data-[keyboard]/menu:data-[highlighted]:outline-ring';
const selectedItem = 'data-[state=checked]:text-ui-label-large data-[state=checked]:text-accent-foreground';

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** `destructive` shows a trash icon and red text (Figma: State = Destructive). */
  variant?: 'default' | 'destructive';
  /** Leading icon. */
  icon?: React.ReactNode;
}

function ItemBody({ children, description }: { children: React.ReactNode; description?: React.ReactNode }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span>{children}</span>
      {description && <span className="text-xs leading-normal text-secondary-muted-foreground">{description}</span>}
    </span>
  );
}

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, children, description, variant = 'default', icon, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      itemBase,
      variant === 'destructive'
        ? 'text-ui-label-large text-destructive data-[highlighted]:bg-destructive-soft-hover group-data-[keyboard]/menu:data-[highlighted]:outline-solid group-data-[keyboard]/menu:data-[highlighted]:outline-2 group-data-[keyboard]/menu:data-[highlighted]:-outline-offset-2 group-data-[keyboard]/menu:data-[highlighted]:outline-ring'
        : itemHover,
      className,
    )}
    {...props}
  >
    {variant === 'destructive' && !icon ? <Trash size={16} aria-hidden className="shrink-0" /> : icon}
    <ItemBody description={description}>{children}</ItemBody>
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export interface DropdownMenuSelectableItemProps {
  description?: React.ReactNode;
}

/** A checkable item: the selected state is accent-coloured with a trailing check (Figma: State = Selected). */
export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & DropdownMenuSelectableItemProps
>(({ className, children, description, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem ref={ref} className={cn(itemBase, itemHover, selectedItem, className)} {...props}>
    <ItemBody description={description}>{children}</ItemBody>
    <DropdownMenuPrimitive.ItemIndicator>
      <Check size={16} aria-hidden />
    </DropdownMenuPrimitive.ItemIndicator>
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

/** One choice of a `DropdownMenuRadioGroup`, styled like a selected item when active. */
export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & DropdownMenuSelectableItemProps
>(({ className, children, description, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} className={cn(itemBase, itemHover, selectedItem, className)} {...props}>
    <ItemBody description={description}>{children}</ItemBody>
    <DropdownMenuPrimitive.ItemIndicator>
      <Check size={16} aria-hidden />
    </DropdownMenuPrimitive.ItemIndicator>
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

/** Item that opens a submenu, with a trailing caret (Figma: Expand = Yes). */
export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(itemBase, itemHover, 'data-[state=open]:bg-accent-soft', className)}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <CaretRight size={16} aria-hidden />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, onKeyDown, onPointerMove, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      style={{ zIndex: 'var(--sys-z-30)' }}
      className={cn(contentClasses, 'group/menu flex flex-col gap-0.5', className)}
      {...useKeyboardModality(onKeyDown, onPointerMove)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-ui-caption text-secondary-muted-foreground', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
