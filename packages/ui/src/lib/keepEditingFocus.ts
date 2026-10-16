import type * as React from 'react';

/**
 * Keeps a text field that is being edited active while the reader clicks somewhere else inside the same card (its padding, its labels, the empty space
 * around the field). Put it on the card's `onMouseDown`: a click on a button, link, field or label still does its own job, anything else leaves the focus
 * where it is instead of ending the edit.
 */
export function keepEditingFocus(event: React.MouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, input, textarea, select, label, [role="button"], [role="dialog"]')) return;
  const active = document.activeElement;
  if ((active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement) && event.currentTarget.contains(active)) event.preventDefault();
}
