import type { Meta, StoryObj } from '@storybook/react-vite';

import { QuestionNavItem } from './QuestionNavItem';

const label = 'What do you enjoy most about our coffee?';

const meta = {
  title: 'Question Types/Question Nav Item',
  component: QuestionNavItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'One row of the activity builder\'s question list. Leading icon is the question type; hover swaps it for a drag handle; `error` shows a warning icon; `selected` marks the open question. Source: Custom. Figma: Question navigation.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { children: label },
} satisfies Meta<typeof QuestionNavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OpenEnd: Story = { args: { questionType: 'open-end', children: 'What do you enjoy most about our coffee?' } };
export const Selected: Story = { args: { selected: true } };
export const Error: Story = { args: { error: true } };
export const SelectedWithError: Story = { args: { selected: true, error: true } };

export const List: Story = {
  render: () => (
    <nav aria-label="Questions" className="flex w-106.5 flex-col gap-3">
      <QuestionNavItem questionType="open-end" selected>{label}</QuestionNavItem>
      <QuestionNavItem questionType="rating">How often do you visit?</QuestionNavItem>
      <QuestionNavItem error>Which drinks do you order?</QuestionNavItem>
    </nav>
  ),
};
