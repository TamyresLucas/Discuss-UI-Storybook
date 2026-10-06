import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActivityStructure } from './ActivityStructure';

const meta = {
  title: 'Research-Specific/Activity Structure',
  component: ActivityStructure,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Summary card for an activity under construction: stat tiles plus a settings button. Source: Custom. Figma: Activity control.' } },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: {
    stats: [
      { id: 'questions', label: 'Total questions', value: '3' },
      { id: 'time', label: 'Completion time', value: '10 minutes' },
    ],
    onOpenSettings: () => {},
  },
} satisfies Meta<typeof ActivityStructure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
