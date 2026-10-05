import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Layout & Structure/Accordion',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Expandable content sections in plan/settings. Source: shadcn. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-shadcn'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Accordion" />,
};
