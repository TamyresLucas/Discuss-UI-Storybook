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
          'Text that turns into a field on click. Enter or blur saves, Escape cancels. `multiline` swaps in a textarea (Cmd/Ctrl+Enter saves). There is no shadcn or Figma original, so this is built from the Input tokens. Source: Custom.',
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
export const Multiline: Story = {
  args: {
    multiline: true,
    'aria-label': 'Research goal',
    defaultValue: 'Understand why subscribers stay subscribed rather than switching to a competitor.',
    className: 'w-96',
  },
};
export const Heading: Story = { args: { textClassName: 'text-heading-h4', 'aria-label': 'Section title', defaultValue: 'Target Audience' } };
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
