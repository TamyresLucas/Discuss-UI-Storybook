import * as React from 'react';

import { cn } from '../../lib/utils';
import { Input, type InputProps } from './Input';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export type SearchBarProps = InputProps;

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({ className, ...props }, ref) => (
  <div className="relative flex w-full items-center">
    <span className="pointer-events-none absolute left-3 flex text-muted-foreground">
      <SearchIcon />
    </span>
    <Input ref={ref} type="search" className={cn('pl-10', className)} {...props} />
  </div>
));
SearchBar.displayName = 'SearchBar';
