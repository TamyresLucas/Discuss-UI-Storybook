import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { NavRail, NavRailItem } from './NavRail';

describe('NavRail', () => {
  it('is a named navigation with one button per item, the selected one marked current', () => {
    render(
      <NavRail aria-label="Panels">
        <NavRailItem icon={<svg />} label="Outline" selected />
        <NavRailItem icon={<svg />} label="Ask AI" />
      </NavRail>,
    );
    expect(screen.getByRole('navigation', { name: 'Panels' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Ask AI' })).not.toHaveAttribute('aria-current');
  });

  it('fills the selected icon square and darkens its caption', () => {
    render(
      <NavRail aria-label="Panels">
        <NavRailItem icon={<svg />} label="Outline" selected />
        <NavRailItem icon={<svg />} label="Ask AI" />
      </NavRail>,
    );
    const outline = screen.getByRole('button', { name: 'Outline' });
    const ask = screen.getByRole('button', { name: 'Ask AI' });
    expect(outline).toHaveClass('text-surface-foreground');
    expect(outline.firstElementChild).toHaveClass('bg-secondary');
    expect(ask).toHaveClass('text-secondary-muted-foreground');
    expect(ask.firstElementChild).not.toHaveClass('bg-secondary');
  });

  it('uses the accent-soft colours on hover, selected or not (Figma Hover=Yes)', () => {
    render(
      <NavRail aria-label="Panels">
        <NavRailItem icon={<svg />} label="Outline" selected />
        <NavRailItem icon={<svg />} label="Ask AI" />
      </NavRail>,
    );
    for (const name of ['Outline', 'Ask AI']) {
      const item = screen.getByRole('button', { name });
      expect(item).toHaveClass('hover:text-accent-soft-foreground');
      expect(item.firstElementChild).toHaveClass('group-hover:bg-accent-soft');
    }
  });

  it('calls onClick when an item is picked', () => {
    const onClick = vi.fn();
    render(
      <NavRail aria-label="Panels">
        <NavRailItem icon={<svg />} label="Ask AI" onClick={onClick} />
      </NavRail>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ask AI' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows the footer at the bottom', () => {
    render(
      <NavRail aria-label="Panels" footer={<span>Account</span>}>
        <NavRailItem icon={<svg />} label="Outline" />
      </NavRail>,
    );
    expect(screen.getByText('Account').parentElement).toHaveClass('mt-auto');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <NavRail aria-label="Panels">
        <NavRailItem icon={<svg />} label="Outline" selected />
        <NavRailItem icon={<svg />} label="Ask AI" />
      </NavRail>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
