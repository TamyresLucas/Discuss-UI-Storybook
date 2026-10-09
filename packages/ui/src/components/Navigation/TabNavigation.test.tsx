import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { TabItem } from './TabItem';
import { TabNavigation, Tabs, TabsContent } from './TabNavigation';

const Example = () => (
  <Tabs defaultValue="all">
    <TabNavigation aria-label="Table filter">
      <TabItem value="all">All</TabItem>
      <TabItem value="active">Active</TabItem>
      <TabItem value="archived" disabled>
        Archived
      </TabItem>
    </TabNavigation>
    <TabsContent value="all">All rows</TabsContent>
    <TabsContent value="active">Active rows</TabsContent>
  </Tabs>
);

describe('TabNavigation / TabItem', () => {
  it('selects the default tab and shows its panel', () => {
    render(<Example />);
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('All rows')).toBeVisible();
  });

  it('switches tabs on click', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('tab', { name: 'Active' }));
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Active rows')).toBeVisible();
  });

  it('moves selection with the arrow keys and skips disabled tabs', async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole('tab', { name: 'All' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();
  });

  it('styles items as a toggle inside the toggle variant', () => {
    render(
      <Tabs defaultValue="a">
        <TabNavigation variant="toggle" aria-label="Mode">
          <TabItem value="a" aria-label="Code" />
        </TabNavigation>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveClass('rounded-sm');
  });

  it('styles items as a page-level tab bar inside the underline variant', () => {
    render(
      <Tabs defaultValue="design">
        <TabNavigation variant="underline" aria-label="Sections" className="h-16">
          <TabItem value="design">Design</TabItem>
          <TabItem value="launch">Launch</TabItem>
        </TabNavigation>
      </Tabs>,
    );
    const tab = screen.getByRole('tab', { name: 'Design' });
    expect(tab).toHaveClass('h-full', 'after:h-0.5', 'data-[state=active]:after:bg-accent');
    expect(tab).not.toHaveClass('rounded-full');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
