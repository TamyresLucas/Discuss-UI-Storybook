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
