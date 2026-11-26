import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { ProjectSidebar } from './ProjectSidebar';
import { SidebarNavItem } from './SidebarNavItem';

function Sidebar(props: { onCollapse?: () => void; onPick?: () => void }) {
  return (
    <ProjectSidebar
      aria-label="Project"
      project="Meal kit retention"
      action={props.onCollapse && <button type="button" onClick={props.onCollapse}>Collapse sidebar</button>}
    >
      <SidebarNavItem icon={<svg />} label="Overview" selected />
      <SidebarNavItem icon={<svg />} label="Insights" expandable onClick={props.onPick} />
      <SidebarNavItem icon={<svg />} label="Calendar" />
    </ProjectSidebar>
  );
}

describe('ProjectSidebar', () => {
  it('is a named navigation with the project name in its header', () => {
    render(<Sidebar />);
    expect(screen.getByRole('navigation', { name: 'Project' })).toHaveTextContent('Meal kit retention');
    expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).not.toBeInTheDocument();
  });

  it('shows the action at the right of the header', () => {
    const onCollapse = vi.fn();
    render(<Sidebar onCollapse={onCollapse} />);
    const collapse = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(collapse.parentElement).toHaveClass('h-16', 'border-b');
    fireEvent.click(collapse);
    expect(onCollapse).toHaveBeenCalledOnce();
  });

  it('shows the section label above the items and names the list with it', () => {
    render(
      <ProjectSidebar aria-label="Project navigation" project="Meal kit retention" label="Project">
        <SidebarNavItem icon={<svg />} label="Overview" />
      </ProjectSidebar>,
    );
    expect(screen.getByRole('list', { name: 'Project' })).toBeInTheDocument();
  });

  it('marks the selected item current and fills it', () => {
    render(<Sidebar />);
    const overview = screen.getByRole('button', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-current', 'page');
    expect(overview).toHaveClass('bg-secondary');
    expect(screen.getByRole('button', { name: 'Calendar' })).not.toHaveAttribute('aria-current');
  });

  it('shows a caret and aria-expanded only on expandable items', () => {
    render(<Sidebar />);
    const insights = screen.getByRole('button', { name: 'Insights' });
    expect(insights).toHaveAttribute('aria-expanded', 'false');
    expect(insights.querySelectorAll('svg')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Calendar' })).not.toHaveAttribute('aria-expanded');
  });

  it('calls onClick when an item is picked', () => {
    const onPick = vi.fn();
    render(<Sidebar onPick={onPick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Insights' }));
    expect(onPick).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Sidebar onCollapse={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
