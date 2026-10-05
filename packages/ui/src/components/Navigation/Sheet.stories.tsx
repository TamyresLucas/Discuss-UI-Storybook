import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Navigation/Sheet',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Slide-out side panels for mobile or detail views. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Sheet" />,
};
