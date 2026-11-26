import type { Meta, StoryObj } from '@storybook/react-vite';

import { OrgMonogram } from './OrgMonogram';

const meta = {
  title: 'Identity & People/Org Monogram',
  component: OrgMonogram,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "The organization's initial on a 40px coral square, e.g. in the header of a primary `NavRail`. Figma: \"Org Monogram\". Source: Custom.",
      },
    },
  },
  tags: ['autodocs', 'status:done', 'source-custom'],
  args: { children: 'D' },
} satisfies Meta<typeof OrgMonogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
