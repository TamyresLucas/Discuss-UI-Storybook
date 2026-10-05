import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Data Display/Progress',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Progress bar for video seek and storage usage. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Progress" />,
};
