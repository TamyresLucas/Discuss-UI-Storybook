import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Research-Specific/Project Tags Section',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Editable tags with + Add tag action. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Project Tags Section" />,
};
