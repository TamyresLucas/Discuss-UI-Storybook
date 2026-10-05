import { ArrowClockwise, Copy, PencilSimple, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Buttons & Actions/Button';
import { Timestamp } from './Timestamp';

const icon = (Icon: typeof Copy) => <Icon size={16} aria-hidden />;

const meta = {
  title: 'Conversation & AI Chat/Timestamp',
  component: Timestamp,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Time of a message with its action buttons. `timePosition="before"` suits user messages (retry, edit, copy); `"after"` suits AI replies (copy, like, dislike, retry). Source: Custom. Figma: Timestamp (58).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { time: '5 minutes ago' },
} satisfies Meta<typeof Timestamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  render: (args) => (
    <Timestamp {...args} className="w-62.5">
      <Button variant="ghost" size="icon" aria-label="Retry">{icon(ArrowClockwise)}</Button>
      <Button variant="ghost" size="icon" aria-label="Edit">{icon(PencilSimple)}</Button>
      <Button variant="ghost" size="icon" aria-label="Copy">{icon(Copy)}</Button>
    </Timestamp>
  ),
};

export const AIReply: Story = {
  args: { timePosition: 'after' },
  render: (args) => (
    <Timestamp {...args}>
      <Button variant="ghost" size="icon" aria-label="Copy">{icon(Copy)}</Button>
      <Button variant="ghost" size="icon" aria-label="Good response">{icon(ThumbsUp)}</Button>
      <Button variant="ghost" size="icon" aria-label="Bad response">{icon(ThumbsDown)}</Button>
      <Button variant="ghost" size="icon" aria-label="Retry">{icon(ArrowClockwise)}</Button>
    </Timestamp>
  ),
};

export const TimeOnly: Story = { args: { className: 'w-62.5' } };
