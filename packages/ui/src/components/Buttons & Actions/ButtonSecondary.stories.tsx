import { Plus } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Buttons & Actions/Button (Secondary)',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Outline / subtle / ghost buttons with icon + label (Upload, Filter). Source: shadcn. Figma: Buttons (13).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select', options: ['subtle', 'outline', 'ghost'] },
    size: { control: 'select', options: ['md', 'sm'] },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'subtle', onClick: fn() },
  render: ({ children, ...args }) => (
    <Button {...args}>
      <Plus size={16} aria-hidden />
      {children}
    </Button>
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = { args: { children: 'Subtle' } };
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } };
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } };
export const OutlineDisabled: Story = { args: { children: 'Outline', variant: 'outline', disabled: true } };
