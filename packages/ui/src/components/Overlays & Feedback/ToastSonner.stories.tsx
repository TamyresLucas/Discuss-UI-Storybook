import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Overlays & Feedback/Toast (Sonner)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Success/error feedback for Copy link, uploads. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Toast / Sonner" />,
};
