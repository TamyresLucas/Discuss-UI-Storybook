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
        component: 'Outlined/ghost button with icon + label (Upload, Filter). Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select', options: ['secondary', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { variant: 'secondary', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Upload' } };
export const Outline: Story = { args: { children: 'Filter', variant: 'outline' } };
export const Ghost: Story = { args: { children: 'Dismiss', variant: 'ghost' } };
