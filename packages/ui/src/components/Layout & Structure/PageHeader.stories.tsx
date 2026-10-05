import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Layout & Structure/Page Header',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Title + subtitle row with right-aligned action buttons. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Page Header" />,
};
