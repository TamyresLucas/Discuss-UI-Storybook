import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { TabNavigationContext } from './TabNavigation';

export type TabItemProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

// Figma: Tab Item (08). The shape and states follow the parent TabNavigation variant.
const base =
  'inline-flex h-7 items-center justify-center gap-1 whitespace-nowrap px-2.5 py-1 text-ui-label transition-colors disabled:pointer-events-none disabled:opacity-50';
const filter =
  'rounded-full text-surface-foreground hover:text-accent data-[state=active]:bg-secondary data-[state=active]:bg-linear-to-r data-[state=active]:from-overlay-dark-5 data-[state=active]:to-overlay-dark-5 data-[state=active]:hover:bg-accent-soft data-[state=active]:hover:bg-none data-[state=active]:hover:text-accent-soft-foreground disabled:text-muted-foreground';
const toggle =
  'rounded-sm text-secondary-muted-foreground hover:text-surface-foreground data-[state=active]:bg-surface data-[state=active]:text-surface-foreground';

// Page-level tab bar: the tab fills the bar's height; the active one is semibold with a 2px accent underline.
const underline =
  'relative h-full rounded-none px-4 py-3 font-medium text-secondary-muted-foreground hover:text-surface-foreground data-[state=active]:font-semibold data-[state=active]:text-surface-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:after:bg-accent';

export const TabItem = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabItemProps>(
  ({ className, ...props }, ref) => {
    const variant = React.useContext(TabNavigationContext);
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(base, variant === 'toggle' ? toggle : variant === 'underline' ? underline : filter, className)}
        {...props}
      />
    );
  },
);
TabItem.displayName = 'TabItem';
