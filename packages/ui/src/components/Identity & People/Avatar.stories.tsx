import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from './Avatar';

const meta = {
  title: 'Identity & People/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "A person's picture: a 40px rounded square on orchid-200, the photo covering it, or their initials when there is none (or it fails to load). Figma: \"Avatar\". Source: Custom.",
      },
    },
  },
  tags: ['autodocs', 'status:done', 'source-custom'],
  args: { name: 'Tamyres Lucas' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const Photo: Story = { args: { src: 'https://picsum.photos/seed/avatar/80' } };
