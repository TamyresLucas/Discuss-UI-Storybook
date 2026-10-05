import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Research-Specific/Research Plan Panel',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Structured form: goal, audience, segments, activities. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Research Plan Panel" />,
};
