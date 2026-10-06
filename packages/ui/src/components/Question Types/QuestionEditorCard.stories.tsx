import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Tag } from '../Tags & Badges/Tag';
import { OpenEndAnswer } from './OpenEndAnswer';
import { QuestionEditorCard } from './QuestionEditorCard';
import { QuestionOption } from './QuestionOption';
import { RankList, type RankItemData } from './RankList';
import { RatingScale } from './RatingScale';
import { RadioGroup } from '../Forms & Data Entry/RadioGroup';

const title = 'Which of the following best describes your primary role?';

function Editable(props: Partial<React.ComponentProps<typeof QuestionEditorCard>>) {
  const [text, setText] = React.useState(props.title ?? title);
  return <QuestionEditorCard number={1} {...props} title={text} onTitleChange={setText} />;
}

const choices = ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'];

const meta = {
  title: 'Question Types/Question Editor Card',
  component: QuestionEditorCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The authoring card for each question type. Idle is a flat card; hover (or focus) lifts it and reveals the header actions; `active` adds the accent border, character counter and a footer with the choice count, add and paste buttons. Source: Custom. Figma: Question editor.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { number: 1, title },
} satisfies Meta<typeof QuestionEditorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const singleChoice = (
  <RadioGroup aria-label="Choices" className="gap-4">
    {choices.map((c) => (
      <QuestionOption key={c} value={c} label={c} />
    ))}
  </RadioGroup>
);

export const SelectOne: Story = {
  render: () => <Editable>{singleChoice}</Editable>,
};

export const SelectOneActive: Story = {
  render: () => (
    <Editable active countLabel="4/20 choices" onAdd={() => {}} onPaste={() => {}}>
      {singleChoice}
    </Editable>
  ),
};

export const SelectMultiple: Story = {
  render: () => (
    <Editable active countLabel="4/20 choices" onAdd={() => {}} onPaste={() => {}}>
      <div className="flex flex-col gap-4">
        {choices.map((c) => (
          <QuestionOption key={c} kind="checkbox" label="Checkbox option" />
        ))}
      </div>
    </Editable>
  ),
};

function RankingExample() {
  const [items, setItems] = React.useState<RankItemData[]>(
    ['Product Quality', 'Customer Service', 'Price', 'Brand Reputation'].map((label) => ({ id: label, label })),
  );
  return (
    <Editable active countLabel="4/15 choices" onAdd={() => {}} onPaste={() => {}}>
      <RankList items={items} onItemsChange={setItems} />
    </Editable>
  );
}
export const Ranking: Story = { render: () => <RankingExample /> };

export const Rate: Story = {
  render: () => (
    <Editable active>
      <RatingScale max={5} defaultValue={4} lowLabel="Not likely" highLabel="Very likely" />
    </Editable>
  ),
};

export const OpenEnd: Story = {
  render: () => (
    <Editable
      active
      note={
        <div className="flex flex-col items-start gap-1">
          <Tag>Inferred</Tag>
          <span>Assumes the respondent has purchased from Dana more than once.</span>
        </div>
      }
    >
      <OpenEndAnswer className="max-w-150" />
    </Editable>
  ),
};
