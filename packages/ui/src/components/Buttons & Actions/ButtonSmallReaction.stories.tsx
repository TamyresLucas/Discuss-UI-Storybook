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
        component: 'Compact action buttons (thumbs up/down, copy). Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'outline'] },
  },
  args: { variant: 'ghost', size: 'sm', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThumbsUp: Story = { args: { children: '👍', 'aria-label': 'Good response' } };
export const Copy: Story = { args: { children: 'Copy' } };
