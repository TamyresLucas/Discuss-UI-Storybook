import { ChatsCircle } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TabItem } from './TabItem';
import { TabNavigation, Tabs } from './TabNavigation';

const meta = {
  title: 'Navigation/Tab Item',
  component: TabItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Individual tab (a Radix Tabs trigger) with selected, hover and disabled states. Shape follows the parent `TabNavigation` variant. Source: shadcn. Figma: Tab Item (08).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  decorators: [
    (Story) => (
      <Tabs defaultValue="tab">
        <TabNavigation aria-label="Example">
          <Story />
        </TabNavigation>
      </Tabs>
    ),
  ],
} satisfies Meta<typeof TabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = { args: { value: 'tab', children: 'Tab' } };
export const Unselected: Story = { args: { value: 'other', children: 'Tab' } };
export const Disabled: Story = { args: { value: 'off', children: 'Tab', disabled: true } };
export const ModeToggleItem: Story = {
  args: { value: 'chat', 'aria-label': 'Chat', children: <ChatsCircle size={16} aria-hidden /> },
  decorators: [
    (Story) => (
      <Tabs defaultValue="code">
        <TabNavigation variant="toggle" aria-label="Mode">
          <Story />
        </TabNavigation>
      </Tabs>
    ),
  ],
};
