import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Overlays & Feedback/Dialog (Modal)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'For Manage Members, file uploads, creating projects. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Dialog / Modal" />,
};
