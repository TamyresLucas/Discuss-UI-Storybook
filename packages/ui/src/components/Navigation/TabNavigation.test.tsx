import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

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

describe('the sliding indicator', () => {
  // jsdom has no layout: give each tab a position from its data-x / data-w attributes.
  const offsets = { left: 'data-x', width: 'data-w' } as const
  beforeAll(() => {
    for (const [prop, attr] of [['offsetLeft', offsets.left], ['offsetWidth', offsets.width]] as const)
      Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get() { return Number(this.getAttribute(attr) ?? 0) } })
  })
  afterEach(() => undefined)

  const Pills = ({ variant }: { variant?: 'filter' | 'toggle' | 'underline' }) => (
    <Tabs defaultValue="a">
      <TabNavigation aria-label="Sections" variant={variant}>
        <TabItem value="a" data-x="2" data-w="60">A</TabItem>
        <TabItem value="b" data-x="66" data-w="80">B</TabItem>
      </TabNavigation>
    </Tabs>
  )
  const indicator = () => document.querySelector<HTMLElement>('[data-slot="tab-indicator"]')

  it('draws the selected tab background as one element placed on that tab', async () => {
    render(<Pills />)
    expect(indicator()).toHaveStyle({ left: '2px', width: '60px' })
    expect(indicator()).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('tab', { name: 'A' })).not.toHaveClass('data-[state=active]:bg-secondary')
  })

  it('slides to the newly selected tab with a transition, not a jump', async () => {
    const user = userEvent.setup()
    render(<Pills />)
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    await user.click(screen.getByRole('tab', { name: 'B' }))
    await waitFor(() => expect(indicator()).toHaveStyle({ left: '66px', width: '80px' }))
    expect(indicator()?.className).toContain('transition-[left,top,width,height]')
  })

  it('also slides in the toggle variant, and not in the underline variant', () => {
    const { unmount } = render(<Pills variant="toggle" />)
    expect(indicator()).toHaveClass('bg-surface')
    unmount()
    render(<Pills variant="underline" />)
    expect(indicator()).toBeNull()
  })
})
