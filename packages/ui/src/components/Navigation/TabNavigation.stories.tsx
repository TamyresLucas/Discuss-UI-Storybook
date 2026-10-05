import { ChatsCircle, Code } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TabItem } from './TabItem';
import { TabNavigation, Tabs } from './TabNavigation';

const meta = {
  title: 'Navigation/Tab Navigation',
  component: TabNavigation,
  subcomponents: { Tabs, TabItem },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Container for a set of tabs, built on Radix Tabs. `filter` is the pill-shaped table filter; `toggle` is the icon-only mode switch. Source: shadcn. Figma: Tab Navigation (07).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: { variant: { control: 'inline-radio', options: ['filter', 'toggle'] } },
} satisfies Meta<typeof TabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableFilter: Story = {
  args: { variant: 'filter', 'aria-label': 'Table filter' },
  render: (args) => (
    <Tabs defaultValue="1">
      <TabNavigation {...args}>
        <TabItem value="1">Tab</TabItem>
        <TabItem value="2">Tab</TabItem>
        <TabItem value="3">Tab</TabItem>
        <TabItem value="4">Tab</TabItem>
      </TabNavigation>
    </Tabs>
  ),
};

export const ModeToggle: Story = {
  args: { variant: 'toggle', 'aria-label': 'Mode' },
  render: (args) => (
    <Tabs defaultValue="code">
      <TabNavigation {...args}>
        <TabItem value="code" aria-label="Code">
          <Code size={16} aria-hidden />
        </TabItem>
        <TabItem value="chat" aria-label="Chat">
          <ChatsCircle size={16} aria-hidden />
        </TabItem>
      </TabNavigation>
    </Tabs>
  ),
};
