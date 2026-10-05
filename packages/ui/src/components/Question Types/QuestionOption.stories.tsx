import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { RadioGroup } from '../Forms & Data Entry/RadioGroup';
import { QuestionOption, QuestionOptionEditor, QuestionOtherOption } from './QuestionOption';

const roles = ['Product Designer / UI UX', 'Software Engineer', 'Product Manager', 'Other / General'];

const meta = {
  title: 'Question Types/Question Option',
  component: QuestionOption,
  subcomponents: { QuestionOtherOption, QuestionOptionEditor },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Answer choices for single and multiple choice questions: a full-width card with a radio or checkbox. Selected gets the accent border, hover fills `accent-soft` with a shadow. Also covers the free-text "Other" option and the editor row. Source: Custom. Figma: Question input.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [(Story) => <div className="w-88.5"><Story /></div>],
  args: { label: 'Radio option', value: 'a' },
} satisfies Meta<typeof QuestionOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleChoice: Story = {
  render: () => (
    <RadioGroup aria-label="Primary role" defaultValue={roles[0]} className="gap-4">
      {roles.map((role) => (
        <QuestionOption key={role} value={role} label={role} />
      ))}
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Software Engineer' }));
    await expect(canvas.getByRole('radio', { name: 'Software Engineer' })).toBeChecked();
  },
};

export const MultipleChoice: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {roles.map((role, index) => (
        <QuestionOption key={role} kind="checkbox" label={role} defaultChecked={index === 0} />
      ))}
    </div>
  ),
};

export const Other: StoryObj<typeof QuestionOtherOption> = {
  render: () => <QuestionOtherOption aria-label="Other answer" />,
};

function Editor() {
  const [labels, setLabels] = React.useState(['Radio option']);
  return (
    <div className="flex flex-col gap-2">
      {labels.map((label, index) => (
        <QuestionOptionEditor
          key={index}
          label={label}
          onLabelChange={(next) => setLabels((l) => l.map((x, i) => (i === index ? next : x)))}
          onRemove={() => setLabels((l) => l.filter((_, i) => i !== index))}
          onAdd={() => setLabels((l) => [...l, 'Radio option'])}
        />
      ))}
    </div>
  );
}

export const EditorRow: StoryObj<typeof QuestionOptionEditor> = { render: () => <Editor /> };
