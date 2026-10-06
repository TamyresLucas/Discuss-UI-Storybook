import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActivityStructure } from './ActivityStructure';

const meta = {
  title: 'Research-Specific/Activity Structure',
  component: ActivityStructure,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Summary card for an activity under construction: stat tiles plus text sections with removable tags. Source: Custom. Figma: Activity control.' } },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: {
    stats: [
      { id: 'questions', label: 'Total questions', value: '3' },
      { id: 'time', label: 'Completion time', value: '10 minutes' },
    ],
    sections: [
      {
        id: 'goal',
        heading: 'Research Goal',
        body: 'Understand why subscribers choose to remain subscribed to your meal kit service rather than switching to a competitor — and which factors (price, recipe variety, ingredient quality, convenience, brand reputation, etc.) most influence that decision.',
      },
      {
        id: 'audience',
        heading: 'Target Audience',
        body: 'Adults in the United States and Canada who have subscribed to a meal kit service for at least three months.',
        tags: ['United States', 'Canada', 'Adult', '3 month subscription'],
      },
    ],
    onRemoveTag: () => {},
    onAddTag: () => {},
  },
} satisfies Meta<typeof ActivityStructure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
