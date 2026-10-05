import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Files & Documents/File List Item',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Row with file type icon, name, chevron/action. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="File List Item" />,
};
