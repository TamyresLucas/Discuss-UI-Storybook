import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Data Display/Sentiment Card',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Insight card with sentiment label, %, donut, CTA. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Sentiment Card" />,
};
