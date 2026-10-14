import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

/** `filter` is the pill-shaped table filter; `toggle` is the icon-only mode switch; `underline` is the page-level tab bar (give it the height of its bar, e.g. `h-16`; the active tab gets an accent underline). */
export type TabNavigationVariant = 'filter' | 'toggle' | 'underline';

export const TabNavigationContext = React.createContext<TabNavigationVariant>('filter');

const tabNavigationVariants = cva('inline-flex items-start gap-1 p-0.5', {
  variants: {
    variant: {
      // `relative`: the sliding indicator is positioned against the list.
      filter: 'relative rounded-full border border-border bg-surface',
      toggle: 'relative rounded-md bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5',
      underline: 'items-stretch p-0',
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

interface Box {
  left: number
  top: number
  width: number
  height: number
}

// The selected tab's background is one element that slides to the newly selected tab (filter and toggle variants), instead of
// each tab painting its own: it is measured from the active tab and follows it as the selection or the size of the list changes.
const indicatorClasses: Record<'filter' | 'toggle', string> = {
  filter: 'rounded-full bg-secondary bg-linear-to-r from-overlay-dark-5 to-overlay-dark-5',
  toggle: 'rounded-sm bg-surface',
};

export const TabNavigation = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabNavigationProps>(
  ({ className, variant = 'filter', children, ...props }, forwardedRef) => {
    const kind = variant ?? 'filter';
    const slides = kind !== 'underline';
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const [box, setBox] = React.useState<Box | null>(null);
    // The first placement is instant; only later moves are animated.
    const [animate, setAnimate] = React.useState(false);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [forwardedRef],
    );

    React.useLayoutEffect(() => {
      const list = listRef.current;
      if (!slides || !list) return;
      const measure = () => {
        const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
        const next = active ? { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight } : null;
        setBox((prev) => (prev && next && prev.left === next.left && prev.top === next.top && prev.width === next.width && prev.height === next.height ? prev : next));
      };
      measure();
      const mutations = new MutationObserver(measure);
      mutations.observe(list, { attributes: true, attributeFilter: ['data-state'], subtree: true, childList: true });
      const resizes = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
      resizes?.observe(list);
      const frame = requestAnimationFrame(() => setAnimate(true));
      return () => {
        mutations.disconnect();
        resizes?.disconnect();
        cancelAnimationFrame(frame);
      };
    }, [slides]);

    return (
      <TabNavigationContext.Provider value={kind}>
        <TabsPrimitive.List ref={setRefs} className={cn(tabNavigationVariants({ variant }), className)} {...props}>
          {slides && box && (
            <span
              aria-hidden
              data-slot="tab-indicator"
              className={cn(
                'pointer-events-none absolute',
                indicatorClasses[kind as 'filter' | 'toggle'],
                animate && 'transition-[left,top,width,height] duration-200 ease-out motion-reduce:transition-none',
              )}
              style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
            />
          )}
          {children}
        </TabsPrimitive.List>
      </TabNavigationContext.Provider>
    );
  },
);
TabNavigation.displayName = 'TabNavigation';
