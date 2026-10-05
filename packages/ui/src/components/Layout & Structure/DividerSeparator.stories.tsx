import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Layout & Structure/Divider (Separator)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Thin vertical or horizontal separator line. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Divider / Separator" />,
};
