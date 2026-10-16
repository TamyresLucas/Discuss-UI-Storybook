import { Copy, Eye, Sparkle, Trash } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Button } from '../Buttons & Actions/Button';
import { QuestionHeader } from './QuestionHeader';

const title = 'Which of the following best describes your primary role?';

const meta = {
  title: 'Question Types/Question Header',
  component: QuestionHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Header of a question card: an eyebrow ("QUESTION 01"), a display title, an optional required asterisk and error banner. In editor mode the title is editable with a character counter, and the actions appear on hover or focus. Source: Custom. Figma: Question card components.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [(Story) => <div className="w-107.5"><Story /></div>],
  args: { number: 1, title },
} satisfies Meta<typeof QuestionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const WithError: Story = { args: { required: true, error: true } };
export const WithCustomError: Story = { args: { required: true, error: 'Please choose at least two options.' } };

function EditorHeader() {
  const [text, setText] = React.useState(title);
  return (
    <QuestionHeader
      number={1}
      editor
      title={text}
      onTitleChange={setText}
      actions={
        <>
          <Button variant="ghost" size="icon-sm" aria-label="Duplicate"><Copy size={16} aria-hidden /></Button>
          <Button variant="destructive" size="icon-sm" aria-label="Delete"><Trash size={16} aria-hidden /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Preview"><Eye size={16} aria-hidden /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Improve with AI"><Sparkle size={16} aria-hidden /></Button>
        </>
      }
    />
  );
}

export const Editor: Story = { render: () => <EditorHeader /> };

/** With `dragHandleProps` the "Question N" tag is a focusable drag handle (here wired to a logger). */
export const EditorDragHandle: Story = {
  render: () => (
    <QuestionHeader
      number={2}
      editor
      active
      title={title}
      dragHandleProps={{ role: 'button', tabIndex: 0, onKeyDown: (event) => console.log('handle key', event.key) }}
    />
  ),
};

/** The "Question N" tag shows the question type's icon by default and when selected; on hover the grip replaces it. */
export const EditorWithTypeIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <QuestionHeader number={1} editor questionType="select-one" title={title} />
      <QuestionHeader number={2} editor active questionType="open-end" title={title} dragHandleProps={{ role: 'button', tabIndex: 0 }} />
    </div>
  ),
};

/** Misspelled words (or any ranges you pass) are underlined in the destructive colour in the saved title. */
export const EditorWithMarks: Story = {
  render: () => <QuestionHeader number={1} editor questionType="open-end" title="Tell me about a speling mistake you made" titleMarks={[{ start: 15, end: 22 }]} />,
};
