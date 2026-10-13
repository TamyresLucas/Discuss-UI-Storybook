import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { InlineEdit } from './InlineEdit';

const meta = {
  title: 'Forms & Data Entry/Inline Edit',
  component: InlineEdit,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text that turns into a field on click. Enter or blur saves, Escape cancels. A short single-line label hugs its text and shows a pencil on hover. `multiline` (longer text) swaps in a textarea (Cmd/Ctrl+Enter saves), hides the pencil and fills the width. `variant="question"` is for question text: full width, no pencil, square corners, and a bottom border that uses the input border colour on hover and turns accent while `selected`; Enter saves and Shift+Enter adds a line break. There is no shadcn or Figma original, so this is built from the Input tokens. Source: Custom.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { 'aria-label': 'Activity name', defaultValue: 'Meal kit retention study', onValueChange: fn() },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    const field = canvas.getByRole('textbox', { name: 'Activity name' });
    await userEvent.clear(field);
    await userEvent.type(field, 'Renamed{enter}');
    await expect(args.onValueChange).toHaveBeenCalledWith('Renamed');
    await expect(canvas.getByRole('button')).toHaveTextContent('Renamed');
  },
};
export const Empty: Story = { args: { defaultValue: '', placeholder: 'Add a title' } };
/** Longer text: no pencil, and the text fills the full width of the box. */
export const Multiline: Story = {
  args: {
    multiline: true,
    'aria-label': 'Research goal',
    defaultValue: 'Understand why subscribers stay subscribed rather than switching to a competitor.',
    className: 'w-96',
  },
};
const questionText = 'Which of the following best describes your primary role?';
/** Question text: square corners and a bottom border on hover. */
export const Question: Story = {
  args: { variant: 'question', multiline: true, 'aria-label': 'Question title', defaultValue: questionText, textClassName: 'text-heading-h4', className: 'w-120' },
};
/** The bottom border stays while the question is selected. */
export const QuestionSelected: Story = { args: { ...Question.args, selected: true } };
export const QuestionEmpty: Story = {
  args: { ...Question.args, defaultValue: '', placeholder: 'Click to write the question text' },
};
export const Heading: Story = { args: { textClassName: 'text-heading-h4', 'aria-label': 'Section title', defaultValue: 'Target Audience' } };
/** A longer text with a length range: leaving it too short (or empty) is refused with a message instead of saved. */
export const Validated: Story = {
  args: {
    multiline: true,
    minLength: 20,
    maxLength: 120,
    'aria-label': 'Research goal',
    defaultValue: 'Understand why subscribers stay with the service.',
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('Controlled value');
    return (
      <div className="flex flex-col gap-2">
        <InlineEdit {...args} value={value} onValueChange={setValue} />
        <p className="text-ui-caption text-secondary-muted-foreground">Saved: {value}</p>
      </div>
    );
  },
};
