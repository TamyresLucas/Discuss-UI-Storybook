import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, Sparkle } from '@phosphor-icons/react';

import { NavRail, NavRailItem } from './NavRail';

const meta = {
  title: 'Navigation/Nav Rail (App Sidebar)',
  component: NavRail,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A narrow vertical rail on the edge of the page that switches what the panel beside it shows: an icon on a 36px square with a caption, the selected one filled. An optional footer sits at the bottom (e.g. an avatar). Figma: "Design rail". The consumer owns the selection. Source: Custom.',
      },
    },
  },
  tags: ['autodocs', 'status:done', 'source-custom'],
  args: { 'aria-label': 'Panels' },
} satisfies Meta<typeof NavRail>;

export default meta;
type Story = StoryObj<typeof meta>;

function Switcher() {
  const [view, setView] = React.useState<'outline' | 'ai'>('outline');
  return (
    <div className="h-96">
      <NavRail aria-label="Panels">
        <NavRailItem icon={<List />} label="Outline" selected={view === 'outline'} onClick={() => setView('outline')} />
        <NavRailItem icon={<Sparkle />} label="Ask AI" selected={view === 'ai'} onClick={() => setView('ai')} />
      </NavRail>
    </div>
  );
}

export const Default: Story = {
  render: () => <Switcher />,
};
