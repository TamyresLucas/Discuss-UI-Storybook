import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class lists, resolving Tailwind class conflicts so a consumer-supplied
 * `className` always wins over an internal default. See COMPONENT_CONTRACTS.md.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
