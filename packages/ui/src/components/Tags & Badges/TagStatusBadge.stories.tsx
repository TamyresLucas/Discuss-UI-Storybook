import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusTag, Tag } from './Tag';

const meta = {
  title: 'Tags & Badges/Tag (Status Badge)',
  component: Tag,
  subcomponents: { StatusTag },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Status labels (Live Interview, Self-paced, AI Interview). `Tag` is the system tag; `StatusTag` adds a coloured status dot. Source: Custom. Figma: Tag / Status Badge (41).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'default', 'success', 'warning', 'destructive'] },
  },
  args: { children: 'Label' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { variant: 'neutral' } };
export const Default: Story = { args: { variant: 'default' } };
export const Success: Story = { args: { variant: 'success' } };
export const Warning: Story = { args: { variant: 'warning' } };
export const Destructive: Story = { args: { variant: 'destructive' } };

export const AllSystemTags: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['neutral', 'destructive', 'default', 'success', 'warning'] as const).map((variant) => (
        <Tag key={variant} variant={variant}>
          Label
        </Tag>
      ))}
    </div>
  ),
};

export const StatusTags: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['active', 'inactive', 'pending', 'error'] as const).map((status) => (
        <StatusTag key={status} status={status}>
          Label
        </StatusTag>
      ))}
    </div>
  ),
};
