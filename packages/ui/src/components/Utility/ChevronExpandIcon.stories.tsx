import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from '../shared/Placeholder';

const meta = {
  title: 'Utility/Chevron (Expand Icon)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Directional icon for expand/collapse and dropdowns. Source: Custom. Status: To Do.',
      },
    },
  },
  tags: ['status:todo', 'source-custom'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Placeholder name="Chevron / Expand Icon" />,
};
