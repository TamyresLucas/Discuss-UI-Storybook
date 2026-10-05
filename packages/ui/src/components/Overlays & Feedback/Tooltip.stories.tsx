import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Overlays & Feedback/Tooltip',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Hover labels for icon-only buttons in rail, headers. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Tooltip" />,
};
