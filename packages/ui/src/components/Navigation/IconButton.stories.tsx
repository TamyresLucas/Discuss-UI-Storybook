import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Navigation/Icon Button',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Circular/square icon-only button for rail, headers, toolbars. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Icon Button" />,
};
