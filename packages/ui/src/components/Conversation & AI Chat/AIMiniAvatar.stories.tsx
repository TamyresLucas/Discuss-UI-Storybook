import type { Meta, StoryObj } from '@storybook/react-vite';

import { AIMiniAvatar } from './AIMiniAvatar';

const meta = {
  title: 'Conversation & AI Chat/AI Mini Avatar',
  component: AIMiniAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The AI mark with an optional status line (Thinking, Executing, Working on it + elapsed time). Pulses while busy, unless the user prefers reduced motion. Announced politely to screen readers. Source: Custom. Figma: AI Mini Avatar (57).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: { status: { control: 'select', options: ['idle', 'thinking', 'executing', 'working'] } },
} satisfies Meta<typeof AIMiniAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = { args: { status: 'idle' } };
export const Thinking: Story = { args: { status: 'thinking' } };
export const Executing: Story = { args: { status: 'executing' } };
export const WorkingOnIt: Story = { args: { status: 'working', elapsed: '45 s' } };
