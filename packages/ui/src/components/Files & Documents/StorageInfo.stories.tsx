import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Files & Documents/Storage Info',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text showing storage usage (49.3 GB of 94 files left). Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Storage Info" />,
};
