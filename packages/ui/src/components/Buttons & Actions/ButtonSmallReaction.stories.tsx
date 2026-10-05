import { Plus } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Buttons & Actions/Button (Small – Reaction)',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact 32px action buttons (thumbs up/down, copy): `size="sm"` with a label, `size="icon-sm"` icon-only. Source: shadcn. Figma: Button (Small/Reaction) (16).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select', options: ['outline', 'subtle', 'ghost', 'default', 'destructive'] },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'outline', size: 'sm', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  args: { children: 'Outline' },
  render: ({ children, ...args }) => (
    <Button {...args}>
      <Plus size={16} aria-hidden />
      {children}
    </Button>
  ),
};
export const IconOnly: Story = {
  args: { size: 'icon-sm', 'aria-label': 'Add', variant: 'ghost' },
  render: (args) => (
    <Button {...args}>
      <Plus size={16} aria-hidden />
    </Button>
  ),
};
export const Disabled: Story = { args: { children: 'Outline', disabled: true } };
