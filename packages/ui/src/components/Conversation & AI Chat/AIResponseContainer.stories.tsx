import { ArrowClockwise, Clipboard, Clock, Copy, FolderOpen, Question, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Buttons & Actions/Button';
import { RoleTag } from '../Tags & Badges/RoleTag';
import { AIMiniAvatar } from './AIMiniAvatar';
import { AIResponseContainer } from './AIResponseContainer';
import { Timestamp } from './Timestamp';
import { TopicActivityRow, TopicCard, TopicCardMetaItem, TopicCardTag } from './TopicCard';

const actions = (
  <Timestamp time="5 minutes ago" timePosition="after">
    <Button variant="ghost" size="icon" aria-label="Copy"><Copy size={16} aria-hidden /></Button>
    <Button variant="ghost" size="icon" aria-label="Good response"><ThumbsUp size={16} aria-hidden /></Button>
    <Button variant="ghost" size="icon" aria-label="Bad response"><ThumbsDown size={16} aria-hidden /></Button>
    <Button variant="ghost" size="icon" aria-label="Retry"><ArrowClockwise size={16} aria-hidden /></Button>
  </Timestamp>
);

const researchGoal = (
  <TopicCard
    icon={<FolderOpen weight="fill" />}
    title="Meal kit retention"
    badge={<RoleTag>English (United States)</RoleTag>}
    description="Understand why subscribers choose to remain subscribed to your meal kit service rather than switching to a competitor — and which factors (price, recipe variety, ingredient quality, convenience, brand reputation, etc.) most influence that decision."
    tags={
      <>
        <TopicCardTag>Buyer Decision</TopicCardTag>
        <TopicCardTag>Competitive Analysis</TopicCardTag>
      </>
    }
  />
);

const meta = {
  title: 'Conversation & AI Chat/AI Response Container',
  component: AIResponseContainer,
  subcomponents: { TopicCard, TopicActivityRow },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A full AI reply: display-font title, rich content (text and `TopicCard`s), message actions and the AI status line. Source: Custom. Figma: AI Response Container (55).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
} satisfies Meta<typeof AIResponseContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChatReply: Story = {
  args: {
    title: 'Confirm new project.',
    actions,
    feedback: <AIMiniAvatar />,
    children: (
      <>
        <p>
          Based on your document, here's a project setup I'd recommend. Review the research goal, language, and tags
          below to make sure it all fits before I create it.
        </p>
        {researchGoal}
        <p>Once you confirm, the project will be created with these settings. Want to make any changes first?</p>
      </>
    ),
  },
};

export const Topics: Story = {
  render: () => (
    <div className="flex w-190 flex-col">
      <div className="pb-4">{researchGoal}</div>
      <TopicActivityRow status="New Activity Created">Meal kit retention / Decision Drivers</TopicActivityRow>
      <div className="pt-4">
        <TopicCard
          icon={<Clipboard />}
          title="Decision Drivers"
          description="Uncover the key moments and factors that shape a subscriber's decision to stay, leave, or consider alternatives — from initial brand discovery through ongoing usage."
          meta={
            <>
              <TopicCardMetaItem icon={<Question />}>7 Questions</TopicCardMetaItem>
              <TopicCardMetaItem icon={<Clock />}>30 minutes</TopicCardMetaItem>
            </>
          }
        />
      </div>
    </div>
  ),
};

export const Thinking: Story = {
  args: { feedback: <AIMiniAvatar status="thinking" />, children: <p>Working through your document…</p> },
};
