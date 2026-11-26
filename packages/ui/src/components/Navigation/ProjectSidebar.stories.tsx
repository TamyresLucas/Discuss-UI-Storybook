import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clipboard, House, Lightbulb, PencilRuler, Sliders, Video } from '@phosphor-icons/react';

import { ProjectSidebar } from './ProjectSidebar';
import { SidebarNavItem } from './SidebarNavItem';

const meta = {
  title: 'Navigation/Project Sidebar',
  component: ProjectSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The project's navigation beside the page: a 240px column with the project's name and a caret in a 64px header (the switcher), then `SidebarNavItem` rows. Figma: \"Project navigation\". The consumer owns the selection. Source: Custom.",
      },
    },
  },
  tags: ['autodocs', 'status:done', 'source-custom'],
  args: { 'aria-label': 'Project', project: 'Welcome Viewer Project' },
} satisfies Meta<typeof ProjectSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  { id: 'overview', icon: <House weight="fill" />, label: 'Overview' },
  { id: 'design', icon: <PencilRuler />, label: 'Research Design', expandable: true },
  { id: 'fielding', icon: <Clipboard />, label: 'Fielding', expandable: true },
  { id: 'responses', icon: <Video />, label: 'Responses', expandable: true },
  { id: 'insights', icon: <Lightbulb />, label: 'Insights', expandable: true },
  { id: 'settings', icon: <Sliders />, label: 'Settings' },
];

function Sidebar(args: React.ComponentProps<typeof ProjectSidebar>) {
  const [page, setPage] = React.useState('overview');
  return (
    <div className="h-screen">
      <ProjectSidebar {...args} onProjectClick={() => {}}>
        {ITEMS.map((item) => (
          <SidebarNavItem key={item.id} icon={item.icon} label={item.label} expandable={item.expandable} selected={page === item.id} onClick={() => setPage(item.id)} />
        ))}
      </ProjectSidebar>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Sidebar {...args} />,
};
