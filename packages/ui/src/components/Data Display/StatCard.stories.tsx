import { Warning } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatCard } from './StatCard';

const meta = {
  title: 'Data Display/Stat Card',
  component: StatCard,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A small label/value tile; `warning` tints it yellow. Source: Custom. Figma: Activity control › stat-card.' } },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { label: 'Total questions', value: '3', className: 'w-40.75' },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Warning_: Story = {
  name: 'Warning',
  args: { variant: 'warning', value: '38', icon: <Warning size={24} className="text-warning-soft-foreground" /> },
};

/** A tinted card with no border, for stats on a white panel. */
export const Subtle: Story = { args: { variant: 'subtle' } };
