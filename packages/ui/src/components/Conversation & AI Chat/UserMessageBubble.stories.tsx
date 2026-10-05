import { ArrowClockwise, Copy, PencilSimple } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from '../Buttons & Actions/Button';
import { AskAiToggle } from './AskAiToggle';
import { FileAttachment } from './FileAttachment';
import { Timestamp } from './Timestamp';
import { UserMessageBubble } from './UserMessageBubble';

const fileName = '_712020a30cd77748de4da1bbf42cf9fbf1d622-Design MD Research-110826-200546 (1).pdf';

const meta = {
  title: 'Conversation & AI Chat/User Message Bubble',
  component: UserMessageBubble,
  subcomponents: { FileAttachment, AskAiToggle },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Chat bubble for user messages, with optional file attachments and a timestamp / actions footer. Also covers `FileAttachment` and `AskAiToggle`. Source: Custom. Figma: User Message Bubble (54).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { children: 'I want to understand why people are choosing to purchase cattle from my farm over other farms' },
} satisfies Meta<typeof UserMessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    footer: (
      <Timestamp time="5 minutes ago">
        <Button variant="ghost" size="icon" aria-label="Retry"><ArrowClockwise size={16} aria-hidden /></Button>
        <Button variant="ghost" size="icon" aria-label="Edit"><PencilSimple size={16} aria-hidden /></Button>
        <Button variant="ghost" size="icon" aria-label="Copy"><Copy size={16} aria-hidden /></Button>
      </Timestamp>
    ),
  },
};

export const WithAttachment: Story = {
  args: { attachments: <FileAttachment name={fileName} type="PDF" />, children: 'Here is the research brief.' },
};

export const Attachment: StoryObj<typeof FileAttachment> = {
  render: () => {
    const onRemove = fn();
    return (
      <div className="flex gap-6">
        <FileAttachment name={fileName} type="PDF" onRemove={onRemove} />
        <FileAttachment name={fileName} type="PDF" />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: new RegExp(`Remove`) })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /Remove/ }));
  },
};

export const AskAiToggles: StoryObj<typeof AskAiToggle> = {
  render: () => (
    <div className="flex items-center gap-4">
      <AskAiToggle type="menu" />
      <AskAiToggle type="menu" defaultPressed />
      <AskAiToggle type="action" />
      <AskAiToggle type="action" defaultPressed />
    </div>
  ),
};
