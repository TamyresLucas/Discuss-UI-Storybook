import type { Meta, StoryObj } from '@storybook/react-vite';
import { House, PencilRuler } from '@phosphor-icons/react';

import { SidebarNavItem } from './SidebarNavItem';

const meta = {
  title: 'Navigation/Sidebar Nav Item',
  component: SidebarNavItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'One row of a `ProjectSidebar`: a 16px icon, the label and, for a group of pages, a caret. Selected rows are filled. Figma: "Secondary menu items". Source: Custom.',
      },
    },
  },
  tags: ['autodocs', 'status:done', 'source-custom'],
  decorators: [(Story) => <ul className="w-54"><Story /></ul>],
  args: { icon: <House />, label: 'Overview' },
} satisfies Meta<typeof SidebarNavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true, icon: <House weight="fill" /> } };
export const Expandable: Story = { args: { icon: <PencilRuler />, label: 'Research Design', expandable: true } };
export const Expanded: Story = { args: { icon: <PencilRuler />, label: 'Research Design', expandable: true, expanded: true } };
