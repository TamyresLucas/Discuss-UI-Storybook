import { Plus } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Buttons & Actions/Button (Icon-only)',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Square button with only an icon (40px, or 32px with `icon-sm`). The primary type is a circle at 40px. Always pair with an aria-label since there is no visible text. Source: shadcn. Figma: Buttons (13).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'subtle', 'ghost', 'destructive'] },
    size: { control: 'select', options: ['icon', 'icon-sm'] },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'default', size: 'icon', 'aria-label': 'Add', onClick: fn() },
  render: (args) => (
    <Button {...args}>
      <Plus size={16} aria-hidden />
    </Button>
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Disabled: Story = { args: { disabled: true } };
