import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Research-Specific/Market & Language Table',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Table with language badges, checkmarks, defaults. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Market & Language Table" />,
};
