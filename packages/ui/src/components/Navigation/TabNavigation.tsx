import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

/** `filter` is the pill-shaped table filter; `toggle` is the icon-only mode switch. */
export type TabNavigationVariant = 'filter' | 'toggle';

export const TabNavigationContext = React.createContext<TabNavigationVariant>('filter');

const tabNavigationVariants = cva('inline-flex items-start gap-1 p-0.5', {
  variants: {
    variant: {
      filter: 'rounded-full border border-border bg-surface',
      toggle: 'rounded-md bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5',
    },
  },
  defaultVariants: { variant: 'filter' },
});

/** Radix `Tabs.Root` — owns the selected value; pair with `TabNavigation` + `TabItem` + `TabsContent`. */
export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export interface TabNavigationProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabNavigationVariants> {}

export const TabNavigation = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabNavigationProps>(
  ({ className, variant = 'filter', ...props }, ref) => (
    <TabNavigationContext.Provider value={variant ?? 'filter'}>
      <TabsPrimitive.List ref={ref} className={cn(tabNavigationVariants({ variant }), className)} {...props} />
    </TabNavigationContext.Provider>
  ),
);
TabNavigation.displayName = 'TabNavigation';
