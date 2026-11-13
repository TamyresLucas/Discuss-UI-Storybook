import type { Meta, StoryObj } from '@storybook/react-vite';

import { QuestionNumberTag } from './QuestionNumberTag';

const meta = {
  title: 'Question Types/Question Number Tag',
  component: QuestionNumberTag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The "Question N" tag of a question card in editor mode, on its own: use it to number questions the same way in a list that is not an editor (a plan, a summary). QuestionHeader and QuestionEditorCard draw it for you. Source: Custom. Figma: Question card components.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { number: 1 },
} satisfies Meta<typeof QuestionNumberTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const WithType: Story = { args: { questionType: 'open-end' } };
export const NotMovable: Story = { args: { number: 12, showDragHandle: false } };
