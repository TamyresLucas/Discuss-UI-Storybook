import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { OrgMonogram } from '../Identity & People/OrgMonogram';
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

describe('NavRail hierarchy="primary" (org rail)', () => {
  it('is 72px wide with a header band, 40px squares and a primary-filled selected square', () => {
    render(
      <NavRail aria-label="Organization" hierarchy="primary" header={<OrgMonogram>O</OrgMonogram>}>
        <NavRailItem icon={<svg />} label="Projects" selected />
        <NavRailItem icon={<svg />} label="Admin" />
      </NavRail>,
    );
    const nav = screen.getByRole('navigation', { name: 'Organization' });
    expect(nav).toHaveClass('w-18');
    expect(screen.getByText('O')).toHaveClass('bg-coral-500');
    expect(screen.getByText('O').parentElement).toHaveClass('h-16', 'border-b');
    const projects = screen.getByRole('button', { name: 'Projects' });
    expect(projects).toHaveClass('text-primary');
    expect(projects.firstElementChild).toHaveClass('size-10', 'bg-primary', 'text-primary-foreground');
    expect(screen.getByRole('button', { name: 'Admin' }).firstElementChild).not.toHaveClass('bg-primary');
  });

  it('keeps the secondary rail as before by default', () => {
    render(
      <NavRail aria-label="Panels">
        <NavRailItem icon={<svg />} label="Outline" selected />
      </NavRail>,
    );
    expect(screen.getByRole('navigation')).toHaveClass('w-16');
    expect(screen.getByRole('button', { name: 'Outline' }).firstElementChild).toHaveClass('size-9', 'bg-secondary');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <NavRail aria-label="Organization" hierarchy="primary" header={<OrgMonogram>O</OrgMonogram>}>
        <NavRailItem icon={<svg />} label="Projects" selected />
      </NavRail>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
