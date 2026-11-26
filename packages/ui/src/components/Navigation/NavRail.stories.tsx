import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Brain, ChartDonut, FolderSimple, GearSix, List, Sparkle, UserCircle } from '@phosphor-icons/react';

import { NavRail, NavRailItem, NavRailMonogram } from './NavRail';

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

/** The organization's rail (Figma "Application navigation", hierarchy Primary): monogram in the header, 24px icons, the selected item filled with primary. */
export const Primary: Story = {
  render: () => (
    <div className="h-screen">
      <NavRail aria-label="Organization" hierarchy="primary" header={<NavRailMonogram>O</NavRailMonogram>}>
        <NavRailItem icon={<FolderSimple weight="fill" />} label="Projects" selected />
        <NavRailItem icon={<UserCircle />} label="Personas" />
        <NavRailItem icon={<Brain />} label="Intelligence" />
        <NavRailItem icon={<ChartDonut />} label="Segments" />
        <NavRailItem icon={<GearSix />} label="Admin" />
      </NavRail>
    </div>
  ),
};
