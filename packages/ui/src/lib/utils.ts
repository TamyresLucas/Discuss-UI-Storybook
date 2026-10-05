import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge only knows Tailwind's built-in class names. Without these
// registrations it reads our composite type styles (`text-ui-label`) as a text
// *colour* — so a later `text-surface-foreground` silently drops the type
// style — and `bg-linear-to-r` (Tailwind v4) as a background colour, dropping
// `bg-secondary`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'heading-h1',
            'heading-h2',
            'heading-h3',
            'heading-h4',
            'body-section',
            'body-base',
            'body-small',
            'body-xs',
            'body-xxs',
            'ui-label',
            'ui-label-large',
            'ui-badge',
            'ui-caption',
            'ui-overline',
            'ui-code',
            'ui-placeholder',
            'ui-input-value',
          ],
        },
      ],
      'bg-image': [{ 'bg-linear': ['to-t', 'to-tr', 'to-r', 'to-br', 'to-b', 'to-bl', 'to-l', 'to-tl'] }],
    },
  },
});

/**
 * Merge class lists, resolving Tailwind class conflicts so a consumer-supplied
 * `className` always wins over an internal default. See COMPONENT_CONTRACTS.md.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
