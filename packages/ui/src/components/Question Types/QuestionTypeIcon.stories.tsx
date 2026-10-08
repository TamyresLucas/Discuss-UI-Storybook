import type { Meta, StoryObj } from '@storybook/react-vite';

import { QuestionTypeIcon, type QuestionType } from './QuestionTypeIcon';

const types: QuestionType[] = ['select-one', 'select-multiple', 'ranking', 'upload', 'rating', 'open-end', 'screen-recording'];

const meta = {
  title: 'Question Types/Question Type Icons',
  component: QuestionTypeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Duotone glyphs that identify each question type, in the accent colour. Source: Custom. Figma: Question type icons.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: { type: { control: 'select', options: types } },
  args: { type: 'select-one' },
} satisfies Meta<typeof QuestionTypeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AllTypes: Story = {
  render: () => (
    <div className="flex gap-4">
      {types.map((type) => (
        <QuestionTypeIcon key={type} type={type} />
      ))}
    </div>
  ),
};
